import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  Camera, 
  Settings,
  Activity,
  Trophy,
  Users,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  sport?: string;
  position?: string;
  experience?: number;
  achievements: string[];
  stats: {
    matchesPlayed: number;
    matchesWon: number;
    winRate: number;
    totalGoals: number;
    assists: number;
    rank: number;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profilePublic: boolean;
      showStats: boolean;
      showLocation: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would fetch from your API
      const mockProfile: UserProfile = {
        id: user?.id || '',
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+1 (555) 123-4567',
        avatar: user?.avatar,
        bio: 'Passionate football player with 5+ years of experience. Love playing midfield and creating opportunities for my team.',
        location: 'New York, NY',
        dateOfBirth: '1995-03-15',
        sport: 'Football',
        position: 'Midfielder',
        experience: 5,
        achievements: [
          'Team MVP 2023',
          'League Champion 2022',
          'Most Assists 2021',
          'Fair Play Award 2020'
        ],
        stats: {
          matchesPlayed: 127,
          matchesWon: 89,
          winRate: 70.1,
          totalGoals: 23,
          assists: 45,
          rank: 15
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profilePublic: true,
            showStats: true,
            showLocation: false
          },
          theme: 'auto',
          language: currentLanguage
        }
      };
      
      setProfile(mockProfile);
      setEditedProfile(mockProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // In a real app, this would update via your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => prev ? { ...prev, ...editedProfile } : null);
      setIsEditing(false);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real app, this would upload to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        setEditedProfile(prev => ({ ...prev, avatar: avatarUrl }));
      };
      reader.readAsDataURL(file);
      
      toast.success('Avatar updated');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const handlePreferenceChange = (category: string, key: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences?.[category],
          [key]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!profile) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={editedProfile.avatar || profile.avatar} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <CardTitle className="mt-4">{profile.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{profile.sport}</Badge>
                    <Badge variant="outline">{profile.position}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.dateOfBirth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Bio and Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <Textarea
                      value={editedProfile.bio || profile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.experience}</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.stats.matchesPlayed}</div>
                      <div className="text-sm text-muted-foreground">Matches Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.stats.winRate}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">#{profile.stats.rank}</div>
                      <div className="text-sm text-muted-foreground">Rank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.matchesPlayed}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches Won</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.matchesWon}</div>
                  <p className="text-xs text-muted-foreground">
                    {profile.stats.winRate}% win rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goals Scored</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{profile.stats.totalGoals}</div>
                  <p className="text-xs text-muted-foreground">
                    {profile.stats.assists} assists
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#{profile.stats.rank}</div>
                  <p className="text-xs text-muted-foreground">
                    Top 5% of players
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={editedProfile.preferences?.notifications?.email ?? profile.preferences.notifications.email}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', 'email', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={editedProfile.preferences?.notifications?.push ?? profile.preferences.notifications.push}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', 'push', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                      id="sms-notifications"
                      checked={editedProfile.preferences?.notifications?.sms ?? profile.preferences.notifications.sms}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', 'sms', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <Switch
                      id="public-profile"
                      checked={editedProfile.preferences?.privacy?.profilePublic ?? profile.preferences.privacy.profilePublic}
                      onCheckedChange={(checked) => handlePreferenceChange('privacy', 'profilePublic', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-stats">Show Statistics</Label>
                    <Switch
                      id="show-stats"
                      checked={editedProfile.preferences?.privacy?.showStats ?? profile.preferences.privacy.showStats}
                      onCheckedChange={(checked) => handlePreferenceChange('privacy', 'showStats', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-location">Show Location</Label>
                    <Switch
                      id="show-location"
                      checked={editedProfile.preferences?.privacy?.showLocation ?? profile.preferences.privacy.showLocation}
                      onCheckedChange={(checked) => handlePreferenceChange('privacy', 'showLocation', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <select
                      id="theme"
                      value={editedProfile.preferences?.theme ?? profile.preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', 'theme', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={editedProfile.preferences?.language ?? profile.preferences.language}
                      onChange={(e) => {
                        handlePreferenceChange('language', 'language', e.target.value);
                        setLanguage(e.target.value);
                      }}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveLayout>
  );
};

export default Profile; 