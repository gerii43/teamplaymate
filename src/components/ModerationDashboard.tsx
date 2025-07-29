import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Flag, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  MessageCircle,
  Users,
  BarChart3,
  Clock,
  TrendingUp
} from 'lucide-react';
import { moderationService, ModerationFlag } from '@/services/moderationService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const ModerationDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingFlags, setPendingFlags] = useState<ModerationFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<ModerationFlag | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'warn'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [stats, setStats] = useState({
    totalFlags: 0,
    pendingFlags: 0,
    resolvedFlags: 0,
    autoHiddenContent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingFlags();
    loadModerationStats();
  }, []);

  const loadPendingFlags = async () => {
    try {
      const flags = await moderationService.getPendingFlags();
      setPendingFlags(flags);
    } catch (error) {
      console.error('Error loading pending flags:', error);
      toast.error('Failed to load pending flags');
    } finally {
      setLoading(false);
    }
  };

  const loadModerationStats = async () => {
    try {
      const moderationStats = await moderationService.getModerationStats();
      setStats(moderationStats);
    } catch (error) {
      console.error('Error loading moderation stats:', error);
    }
  };

  const handleReviewFlag = async () => {
    if (!selectedFlag || !user) return;

    try {
      const action = {
        action: reviewAction,
        reason: reviewNotes || `${reviewAction} by moderator`,
        duration: reviewAction === 'warn' ? 7 : undefined
      };

      const success = await moderationService.reviewFlag(
        selectedFlag.id,
        action,
        user.id
      );

      if (success) {
        toast.success(`Flag ${reviewAction}d successfully`);
        setShowReviewModal(false);
        setSelectedFlag(null);
        setReviewNotes('');
        loadPendingFlags();
        loadModerationStats();
      } else {
        toast.error('Failed to review flag');
      }

    } catch (error) {
      console.error('Error reviewing flag:', error);
      toast.error('Failed to review flag');
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'skill_swap': return <Users className="w-4 h-4" />;
      case 'tactic_board': return <BarChart3 className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'message': return 'bg-blue-100 text-blue-800';
      case 'skill_swap': return 'bg-green-100 text-green-800';
      case 'tactic_board': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFlagCard = (flag: ModerationFlag) => (
    <Card key={flag.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getContentTypeColor(flag.content_type)}>
              {getContentTypeIcon(flag.content_type)}
              <span className="ml-1 capitalize">{flag.content_type.replace('_', ' ')}</span>
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-200">
              <Flag className="w-3 h-3 mr-1" />
              Flagged
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500">
            {new Date(flag.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-3">
          <h4 className="font-medium text-gray-900 mb-1">Reason:</h4>
          <p className="text-sm text-gray-700">{flag.reason}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">Flagged by:</h4>
          <p className="text-sm text-gray-700">
            {(flag as any).flagged_by_user?.name || 'Anonymous'}
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setSelectedFlag(flag);
              setReviewAction('approve');
              setShowReviewModal(true);
            }}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
          
          <Button
            onClick={() => {
              setSelectedFlag(flag);
              setReviewAction('reject');
              setShowReviewModal(true);
            }}
            size="sm"
            variant="destructive"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
          
          <Button
            onClick={() => {
              setSelectedFlag(flag);
              setReviewAction('warn');
              setShowReviewModal(true);
            }}
            size="sm"
            variant="outline"
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Warn
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderation Dashboard</h1>
          <p className="text-gray-600">Review and manage community content</p>
        </div>
        
        <Badge className="bg-red-100 text-red-800">
          {stats.pendingFlags} Pending Reviews
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Flags</p>
                <p className="text-2xl font-bold">{stats.totalFlags}</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingFlags}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedFlags}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Hidden</p>
                <p className="text-2xl font-bold text-purple-600">{stats.autoHiddenContent}</p>
              </div>
              <EyeOff className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Flags ({stats.pendingFlags})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingFlags.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingFlags.map(renderFlagCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Flags</h3>
              <p className="text-gray-500">All content has been reviewed!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Resolved Flags</h3>
            <p className="text-gray-500">View previously reviewed content flags</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Moderation Analytics</h3>
            <p className="text-gray-500">View moderation trends and statistics</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Flag</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Action:</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="approve"
                    checked={reviewAction === 'approve'}
                    onChange={(e) => setReviewAction(e.target.value as any)}
                  />
                  <span>Approve (dismiss flag)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="reject"
                    checked={reviewAction === 'reject'}
                    onChange={(e) => setReviewAction(e.target.value as any)}
                  />
                  <span>Reject (hide content)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="warn"
                    checked={reviewAction === 'warn'}
                    onChange={(e) => setReviewAction(e.target.value as any)}
                  />
                  <span>Warn user</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Review Notes:</h4>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add notes about your decision..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowReviewModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReviewFlag}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationDashboard;