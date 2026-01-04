
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { GripVertical, LogOut, Save, Layout, User, Lock, Eye, EyeOff, Upload, ShieldCheck, Loader2, Database } from 'lucide-react';
import { fetchAndSyncData, saveSiteData, resetData, updatePassword, migrateLocalToSupabase, verifyPassword } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("sections");

  // Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch from Supabase
            let siteData = await fetchAndSyncData();
            
            // If null, it means DB is empty. Perform automatic migration from local defaults.
            if (!siteData) {
                toast({ title: "Initializing Database", description: "Migrating local data to Supabase..." });
                siteData = await migrateLocalToSupabase();
                toast({ title: "Migration Complete", description: "Your Supabase database is now ready." });
            }
            
            setData(siteData);
        } catch (error) {
            console.error(error);
            toast({ title: "Error loading data", description: "Could not fetch data from Supabase.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    loadData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        await saveSiteData(data);
        toast({
            title: "Changes Saved",
            description: "Your profile has been updated in Supabase.",
        });
    } catch (error) {
        toast({
            title: "Save Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setSaving(false);
    }
  };

  const handleReset = async () => {
    if(window.confirm("Are you sure? This will WIPE the database and restore defaults.")) {
      setLoading(true);
      try {
        const newData = await resetData();
        setData(newData);
        toast({ title: "Data Reset", description: "All data restored to defaults." });
      } catch (error) {
        toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
        const isValid = await verifyPassword(currentPassword);
        if (!isValid) {
            throw new Error("Current password is incorrect.");
        }
        
        if (newPassword !== confirmPassword) {
            throw new Error("New passwords do not match.");
        }
        
        if (newPassword.length < 4) {
            throw new Error("Password must be at least 4 characters long.");
        }

        await updatePassword(newPassword);
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast({
            title: "Success",
            description: "Password updated in database.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setSaving(false);
    }
  };

  const updateProfile = (field, value) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // NOTE: For production, we should upload to Supabase Storage Bucket.
      // For this implementation, we stick to Base64 in DB as requested by table schema
      // constraint simplicity (text column).
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSection = (id, field, value) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };
  
  const updateSectionData = (id, nestedField, value) => {
     setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
          if (s.id === id) {
              return { ...s, data: { ...s.data, [nestedField]: value } };
          }
          return s;
      })
    }));
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-primary)]">
              <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
                  <p className="text-sm font-medium">Syncing with Supabase...</p>
              </div>
          </div>
      );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <nav className="border-b border-[var(--border)] bg-[var(--bg-card)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center gap-2">
            <span className="w-2 h-8 bg-[var(--accent-color)] rounded-sm"></span>
            Admin Dashboard
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <Database className="w-3 h-3" /> Supabase Connected
             </div>
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-medium hover:text-[var(--accent-color)] transition-colors"
            >
              View Site
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8 pb-20">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Content Manager</h1>
            <div className="flex gap-2">
                <button 
                    onClick={handleReset}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-50"
                >
                    Reset Defaults
                </button>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-[var(--text-primary)] text-[var(--bg-page)] rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[var(--bg-card)] p-1 rounded-xl">
            <TabsTrigger value="sections" className="flex items-center gap-2 data-[state=active]:bg-[var(--bg-page)] data-[state=active]:shadow-sm rounded-lg py-2.5">
              <Layout className="w-4 h-4" /> Sections
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-[var(--bg-page)] data-[state=active]:shadow-sm rounded-lg py-2.5">
              <User className="w-4 h-4" /> Profile & Links
            </TabsTrigger>
             <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-[var(--bg-page)] data-[state=active]:shadow-sm rounded-lg py-2.5">
              <Lock className="w-4 h-4" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
             <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] max-w-md mx-auto">
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-6">
                  <div className="p-2 bg-[var(--bg-page)] rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-[var(--accent-color)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Change Password</h3>
                    <p className="text-xs text-[var(--text-secondary)]">Update your admin login credentials in database</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Current Password</label>
                    <input 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-[var(--text-muted)]">New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                      required
                    />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Confirm New Password</label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-page)] font-bold rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2"
                  >
                     {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update Password
                  </button>
                </form>
             </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] space-y-6">
               <h3 className="text-lg font-bold border-b border-[var(--border)] pb-4">Personal Info</h3>
               <div className="flex gap-6 items-start">
                  <div className="space-y-3 text-center">
                    <img 
                        src={data.profile.image} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="text-xs flex items-center justify-center gap-1 w-full px-2 py-1 bg-[var(--bg-page)] border border-[var(--border)] rounded hover:bg-[var(--hover-bg)]">
                            <Upload className="w-3 h-3" /> Upload
                        </button>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Name</label>
                          <input 
                            value={data.profile.name}
                            onChange={(e) => updateProfile('name', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Title</label>
                          <input 
                            value={data.profile.title}
                            onChange={(e) => updateProfile('title', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Location</label>
                          <input 
                            value={data.profile.location}
                            onChange={(e) => updateProfile('location', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                          />
                      </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-[var(--text-muted)]">Email</label>
                          <input 
                            value={data.profile.email}
                            onChange={(e) => updateProfile('email', e.target.value)}
                            className="w-full px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)]"
                          />
                      </div>
                  </div>
               </div>
            </div>

             <div className="bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] space-y-4">
                <h3 className="text-lg font-bold border-b border-[var(--border)] pb-4">Social Links</h3>
                {data.profile.socials.map((social, idx) => (
                    <div key={social.id} className="flex gap-4 items-center">
                        <div className="w-24 text-sm font-medium">{social.platform}</div>
                        <input 
                            value={social.url}
                            onChange={(e) => {
                                const newSocials = [...data.profile.socials];
                                newSocials[idx].url = e.target.value;
                                updateProfile('socials', newSocials);
                            }}
                            className="flex-1 px-3 py-2 rounded bg-[var(--bg-page)] border border-[var(--border)] text-sm"
                            placeholder={`https://${social.platform.toLowerCase()}.com/...`}
                        />
                    </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="sections">
            <p className="text-sm text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                <GripVertical className="w-4 h-4" /> Drag to reorder sections. Changes apply instantly after saving.
            </p>
            <Reorder.Group 
                axis="y" 
                values={data.sections} 
                onReorder={(newOrder) => setData(prev => ({ ...prev, sections: newOrder }))}
                className="space-y-4"
            >
              {data.sections.map((section) => (
                <Reorder.Item 
                    key={section.id} 
                    value={section}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm"
                >
                    <div className="p-4 flex items-start gap-4">
                        <div className="mt-2 cursor-grab active:cursor-grabbing text-[var(--text-muted)]">
                            <GripVertical className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)] border-dashed">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold uppercase px-2 py-0.5 bg-[var(--bg-page)] rounded border border-[var(--border)]">
                                        {section.type}
                                    </span>
                                    <span className="text-sm text-[var(--text-muted)]">ID: {section.id}</span>
                                </div>
                                <button 
                                    onClick={() => updateSection(section.id, 'isVisible', !section.isVisible)}
                                    className={`p-1.5 rounded-md transition-colors ${section.isVisible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                    title={section.isVisible ? "Section Visible" : "Section Hidden"}
                                >
                                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Section Title</label>
                                    <input 
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded bg-[var(--bg-page)] border border-[var(--border)] font-medium"
                                    />
                                </div>
                                {section.subtitle !== undefined && (
                                     <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Subtitle</label>
                                        <input 
                                            value={section.subtitle}
                                            onChange={(e) => updateSection(section.id, 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded bg-[var(--bg-page)] border border-[var(--border)]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Section Specific Fields */}
                            {section.type === 'book' && (
                                <div className="bg-[var(--bg-page)] p-3 rounded-lg border border-[var(--border)] text-sm space-y-3">
                                    <p className="text-xs font-bold text-[var(--text-secondary)]">Book Details</p>
                                    <input 
                                        value={section.data.title}
                                        onChange={(e) => updateSectionData(section.id, 'title', e.target.value)}
                                        placeholder="Book Title"
                                        className="w-full px-3 py-2 rounded border border-[var(--border)]"
                                    />
                                    <textarea 
                                        value={section.data.description}
                                        onChange={(e) => updateSectionData(section.id, 'description', e.target.value)}
                                        placeholder="Book Description/Quote"
                                        rows={2}
                                        className="w-full px-3 py-2 rounded border border-[var(--border)]"
                                    />
                                     <input 
                                        value={section.data.url}
                                        onChange={(e) => updateSectionData(section.id, 'url', e.target.value)}
                                        placeholder="Amazon URL"
                                        className="w-full px-3 py-2 rounded border border-[var(--border)]"
                                    />
                                </div>
                            )}

                             {section.type === 'writing' && (
                                <div className="bg-[var(--bg-page)] p-3 rounded-lg border border-[var(--border)] text-sm space-y-3">
                                    <p className="text-xs font-bold text-[var(--text-secondary)]">RSS Configuration</p>
                                     <input 
                                        value={section.data.rssUrl}
                                        onChange={(e) => updateSectionData(section.id, 'rssUrl', e.target.value)}
                                        placeholder="RSS Feed URL"
                                        className="w-full px-3 py-2 rounded border border-[var(--border)]"
                                    />
                                </div>
                            )}

                             {section.type === 'links' && (
                                 <div className="space-y-2">
                                     {section.data.links.map((link, idx) => (
                                         <div key={link.id} className="flex gap-2 items-center bg-[var(--bg-page)] p-2 rounded border border-[var(--border)]">
                                             <div className="flex-1 space-y-2">
                                                 <input 
                                                    value={link.title} 
                                                    onChange={(e) => {
                                                        const newLinks = [...section.data.links];
                                                        newLinks[idx].title = e.target.value;
                                                        updateSectionData(section.id, 'links', newLinks);
                                                    }}
                                                    className="w-full p-1 text-xs font-bold bg-transparent border-b border-dashed border-gray-300" 
                                                 />
                                                  <input 
                                                    value={link.url} 
                                                    onChange={(e) => {
                                                        const newLinks = [...section.data.links];
                                                        newLinks[idx].url = e.target.value;
                                                        updateSectionData(section.id, 'links', newLinks);
                                                    }}
                                                    className="w-full p-1 text-xs bg-transparent text-blue-500" 
                                                 />
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}

                        </div>
                    </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
