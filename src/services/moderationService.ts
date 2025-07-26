import { supabase } from '@/lib/supabase';

interface ModerationFlag {
  id: string;
  content_type: 'message' | 'skill_swap' | 'tactic_board' | 'verification_request';
  content_id: string;
  flagged_by: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
}

interface ModerationAction {
  action: 'approve' | 'reject' | 'hide' | 'warn' | 'ban';
  reason: string;
  duration?: number; // For temporary actions
}

interface AutoModerationRule {
  id: string;
  rule_type: 'keyword' | 'spam' | 'toxicity' | 'duplicate';
  parameters: any;
  action: 'flag' | 'hide' | 'warn';
  is_active: boolean;
}

class ModerationService {
  private toxicKeywords = [
    'spam', 'scam', 'fake', 'bot', 'cheat', 'hack',
    // Add more keywords as needed
  ];

  private spamPatterns = [
    /(.)\1{4,}/, // Repeated characters
    /[A-Z]{10,}/, // Excessive caps
    /(.{1,10})\1{3,}/, // Repeated phrases
  ];

  async flagContent(
    contentType: ModerationFlag['content_type'],
    contentId: string,
    reason: string,
    flaggedBy: string
  ): Promise<{ success: boolean; flagId?: string; error?: string }> {
    try {
      // Check if user has already flagged this content
      const { data: existingFlag } = await supabase
        .from('content_flags')
        .select('id')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('flagged_by', flaggedBy)
        .single();

      if (existingFlag) {
        return {
          success: false,
          error: 'You have already flagged this content'
        };
      }

      // Create new flag
      const { data, error } = await supabase
        .from('content_flags')
        .insert({
          content_type: contentType,
          content_id: contentId,
          flagged_by: flaggedBy,
          reason: reason,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Check if content should be auto-hidden (3+ flags)
      await this.checkAutoModeration(contentType, contentId);

      return {
        success: true,
        flagId: data.id
      };

    } catch (error) {
      console.error('Error flagging content:', error);
      return {
        success: false,
        error: 'Failed to flag content'
      };
    }
  }

  async checkAutoModeration(
    contentType: ModerationFlag['content_type'],
    contentId: string
  ): Promise<void> {
    try {
      // Count total flags for this content
      const { count } = await supabase
        .from('content_flags')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('status', 'pending');

      // Auto-hide if 3+ flags
      if (count && count >= 3) {
        await this.hideContent(contentType, contentId, 'auto_moderation');
      }

    } catch (error) {
      console.error('Error in auto moderation check:', error);
    }
  }

  async hideContent(
    contentType: ModerationFlag['content_type'],
    contentId: string,
    reason: string
  ): Promise<boolean> {
    try {
      let tableName: string;
      let updateField: string;

      switch (contentType) {
        case 'message':
          tableName = 'thread_messages';
          updateField = 'is_flagged';
          break;
        case 'skill_swap':
          tableName = 'skill_swaps';
          updateField = 'status';
          break;
        case 'tactic_board':
          tableName = 'tactic_boards';
          updateField = 'is_hidden';
          break;
        default:
          return false;
      }

      const updateData = contentType === 'skill_swap' 
        ? { status: 'hidden' }
        : { [updateField]: true };

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', contentId);

      if (error) throw error;

      // Log moderation action
      await this.logModerationAction(contentType, contentId, 'hide', reason);

      return true;

    } catch (error) {
      console.error('Error hiding content:', error);
      return false;
    }
  }

  async reviewFlag(
    flagId: string,
    action: ModerationAction,
    reviewedBy: string
  ): Promise<boolean> {
    try {
      // Get flag details
      const { data: flag, error: flagError } = await supabase
        .from('content_flags')
        .select('*')
        .eq('id', flagId)
        .single();

      if (flagError || !flag) throw flagError || new Error('Flag not found');

      // Update flag status
      const { error: updateError } = await supabase
        .from('content_flags')
        .update({
          status: 'reviewed',
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', flagId);

      if (updateError) throw updateError;

      // Apply moderation action
      await this.applyModerationAction(
        flag.content_type,
        flag.content_id,
        action,
        reviewedBy
      );

      return true;

    } catch (error) {
      console.error('Error reviewing flag:', error);
      return false;
    }
  }

  async applyModerationAction(
    contentType: ModerationFlag['content_type'],
    contentId: string,
    action: ModerationAction,
    moderatorId: string
  ): Promise<void> {
    try {
      switch (action.action) {
        case 'approve':
          await this.approveContent(contentType, contentId);
          break;
        case 'reject':
        case 'hide':
          await this.hideContent(contentType, contentId, action.reason);
          break;
        case 'warn':
          await this.warnUser(contentType, contentId, action.reason);
          break;
        case 'ban':
          await this.banUser(contentType, contentId, action.duration || 7);
          break;
      }

      // Log the action
      await this.logModerationAction(contentType, contentId, action.action, action.reason, moderatorId);

    } catch (error) {
      console.error('Error applying moderation action:', error);
    }
  }

  async approveContent(
    contentType: ModerationFlag['content_type'],
    contentId: string
  ): Promise<void> {
    // Mark content as approved and dismiss all flags
    await supabase
      .from('content_flags')
      .update({ status: 'dismissed' })
      .eq('content_type', contentType)
      .eq('content_id', contentId);
  }

  async warnUser(
    contentType: ModerationFlag['content_type'],
    contentId: string,
    reason: string
  ): Promise<void> {
    // Get content owner
    const userId = await this.getContentOwner(contentType, contentId);
    if (!userId) return;

    // Create warning notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'moderation_warning',
        title: 'Content Warning',
        message: `Your content has been flagged: ${reason}`,
        data: { content_type: contentType, content_id: contentId },
        created_at: new Date().toISOString()
      });
  }

  async banUser(
    contentType: ModerationFlag['content_type'],
    contentId: string,
    durationDays: number
  ): Promise<void> {
    // Get content owner
    const userId = await this.getContentOwner(contentType, contentId);
    if (!userId) return;

    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + durationDays);

    // Create ban record (you'd need a user_bans table)
    // For now, just create a notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'moderation_ban',
        title: 'Account Temporarily Suspended',
        message: `Your account has been suspended until ${banUntil.toLocaleDateString()} due to community guideline violations.`,
        data: { ban_until: banUntil.toISOString() },
        created_at: new Date().toISOString()
      });
  }

  async getContentOwner(
    contentType: ModerationFlag['content_type'],
    contentId: string
  ): Promise<string | null> {
    try {
      let tableName: string;
      let userField: string;

      switch (contentType) {
        case 'message':
          tableName = 'thread_messages';
          userField = 'user_id';
          break;
        case 'skill_swap':
          tableName = 'skill_swaps';
          userField = 'user_id';
          break;
        case 'tactic_board':
          tableName = 'tactic_boards';
          userField = 'created_by';
          break;
        case 'verification_request':
          tableName = 'verification_requests';
          userField = 'user_id';
          break;
        default:
          return null;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select(userField)
        .eq('id', contentId)
        .single();

      if (error) throw error;

      return data[userField];

    } catch (error) {
      console.error('Error getting content owner:', error);
      return null;
    }
  }

  async logModerationAction(
    contentType: string,
    contentId: string,
    action: string,
    reason: string,
    moderatorId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('moderation_logs')
        .insert({
          content_type: contentType,
          content_id: contentId,
          action: action,
          reason: reason,
          moderator_id: moderatorId,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  }

  // Auto-moderation checks
  async checkContentForViolations(content: string): Promise<{
    isViolation: boolean;
    reasons: string[];
    severity: 'low' | 'medium' | 'high';
  }> {
    const reasons: string[] = [];
    let severity: 'low' | 'medium' | 'high' = 'low';

    // Check for toxic keywords
    const lowerContent = content.toLowerCase();
    const foundKeywords = this.toxicKeywords.filter(keyword => 
      lowerContent.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      reasons.push('Contains inappropriate language');
      severity = 'medium';
    }

    // Check for spam patterns
    const hasSpamPattern = this.spamPatterns.some(pattern => 
      pattern.test(content)
    );

    if (hasSpamPattern) {
      reasons.push('Appears to be spam');
      severity = severity === 'medium' ? 'high' : 'medium';
    }

    // Check content length (very short or very long might be spam)
    if (content.length < 3) {
      reasons.push('Content too short');
      severity = 'low';
    } else if (content.length > 2000) {
      reasons.push('Content too long');
      severity = 'low';
    }

    return {
      isViolation: reasons.length > 0,
      reasons,
      severity
    };
  }

  async getPendingFlags(): Promise<ModerationFlag[]> {
    try {
      const { data, error } = await supabase
        .from('content_flags')
        .select(`
          *,
          flagged_by_user:users!content_flags_flagged_by_fkey(name),
          reviewed_by_user:users!content_flags_reviewed_by_fkey(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];

    } catch (error) {
      console.error('Error getting pending flags:', error);
      return [];
    }
  }

  async getModerationStats(): Promise<{
    totalFlags: number;
    pendingFlags: number;
    resolvedFlags: number;
    autoHiddenContent: number;
  }> {
    try {
      const [totalResult, pendingResult, resolvedResult] = await Promise.all([
        supabase.from('content_flags').select('*', { count: 'exact', head: true }),
        supabase.from('content_flags').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('content_flags').select('*', { count: 'exact', head: true }).eq('status', 'reviewed')
      ]);

      return {
        totalFlags: totalResult.count || 0,
        pendingFlags: pendingResult.count || 0,
        resolvedFlags: resolvedResult.count || 0,
        autoHiddenContent: 0 // Would need additional query
      };

    } catch (error) {
      console.error('Error getting moderation stats:', error);
      return {
        totalFlags: 0,
        pendingFlags: 0,
        resolvedFlags: 0,
        autoHiddenContent: 0
      };
    }
  }
}

export const moderationService = new ModerationService();
export type { ModerationFlag, ModerationAction, AutoModerationRule };