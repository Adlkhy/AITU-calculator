import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCallback, useEffect, useState } from 'react';
import { Navbar08 } from '@/components/Navbar2';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabaseClient'; // Ensure this path is correct
import { GradeCalculator } from '@/components/GradeCalculator'; // Ensure this path is correct
import { BookOpen, ChevronRight, History } from 'lucide-react';
import type { SyllabusData } from '@/hooks/types';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/micah/svg?seed=Brian&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  'https://api.dicebear.com/9.x/micah/svg?seed=Sadie&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  'https://api.dicebear.com/9.x/micah/svg?seed=Vivian&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  'https://api.dicebear.com/9.x/micah/svg?seed=Luis&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  'https://api.dicebear.com/9.x/micah/svg?seed=Andrea&randomizeIds=true&earringColor=6bd9e9,77311d,9287ff,ac6651,d2eff3,e0ddff,f4d150,f9c9b6,fc909f,ffeba4,ffedef&earrings=hoop&ears=attached&eyebrows=eyelashesDown,eyelashesUp,up&facialHairProbability=5&hair=dannyPhantom,fonze,full,mrT,pixie,turban&mouth=laughing,nervous,pucker,smile,smirk,surprised,sad&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  'https://api.dicebear.com/9.x/dylan/svg?seed=Wyatt&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,sad,superHappy',
  'https://api.dicebear.com/9.x/dylan/svg?seed=Sadie&backgroundColor=619eff,ffd5dc,b6e3f4,c0aede&mood=confused,happy,hopeful,neutral,sad,superHappy',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Brian&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Mason&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Luis&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
  'https://api.dicebear.com/9.x/big-smile/svg?seed=Sara&accessories=catEars,clownNose,glasses,mustache,sailormoonCrown,sleepMask,sunglasses&eyes=cheery,normal,sleepy,starstruck,confused&backgroundColor=c0aede,d1d4f9,ffdfbf,b6e3f4',
];

export default function Profile() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', avatar_url: '', social_link: '' });

  // Calculator States
  interface Calculator {
    id: string;
    course_name: string;
    syllabus_data: SyllabusData;
    created_at: string;
  }
  
  const [savedCalculators, setSavedCalculators] = useState<Calculator[]>([]);
  const [selectedCalc, setSelectedCalc] = useState<Calculator | null>(null);
  const [fetchingCalcs, setFetchingCalcs] = useState(true);

  const fetchUserCalculators = useCallback(async () => {
    try {
      setFetchingCalcs(true);
      const { data, error } = await supabase
        .from('calculators')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedCalculators(data || []);
    } catch (err) {
      console.error("Error fetching calculators:", err);
    } finally {
      setFetchingCalcs(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
    if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || AVATAR_OPTIONS[0],
        social_link: user.user_metadata?.social_link || ''
      });
      fetchUserCalculators();
    }
  }, [user, loading, navigate, fetchUserCalculators]);

  const handleSaveProfile = async () => {
    if (!user || !user.id) {
      console.error("No user logged in");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.full_name, 
          avatar_url: formData.avatar_url,
          social_link: formData.social_link 
        }
      });
      if (error) throw error;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url
        })
        .eq('id', user?.id);
      if (profileError) throw profileError;

      console.log("Saved Data:", formData);
      setIsEditing(false);
      // Optional: Refresh page or show success toast
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const game = [[14, 7, 0, 8, 6, 13, 20], [14, 7, 13, 20, 16, 27, 21], [14, 20, 27, 21, 34, 24, 28], [27, 21, 34, 28, 41, 32, 35], [34, 28, 41, 35, 48, 40, 42], [34, 28, 41, 35, 48, 42, 46], [34, 28, 41, 35, 48, 42, 38], [34, 28, 41, 35, 48, 30, 21], [34, 28, 41, 48, 21, 22, 14], [34, 28, 41, 21, 14, 16, 27], [34, 28, 21, 14, 10, 20, 27], [28, 21, 14, 4, 13, 20, 27], [28, 21, 14, 12, 6, 13, 20], [28, 21, 14, 6, 13, 20, 11], [28, 21, 14, 6, 13, 20, 10], [14, 6, 13, 20, 9, 7, 21]]; 

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center flex items-center gap-5 rounded px-4 py-3">
        <DotLoader frames={game} className='gap-0.5' color="primary" duration={150} isPlaying={true} dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' />
        <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <>
    {/* subjects={["▶︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• 0:10", "ᯓ★", "⋆.˚✮🎧✮˚.⋆"] */}
      <Navbar08 />
      <div className="text-foreground min-h-screen font-sans px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        
        {/* PROFILE INFO CARD (Previous logic) */}
        <Card className="my-8 bg-card">
          <CardContent className="">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src={formData.avatar_url} />
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold">{formData.full_name || 'User'}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        {user.user_metadata?.social_link && (
                          <a 
                            href={user.user_metadata.social_link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary text-sm underline mt-1 block"
                          >
                            Social
                          </a>
                        )}
                    </div>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
             </div>
             
             {isEditing ? (
              /* EDIT MODE UI */
              <div className="space-y-6 mt-4">
                <div className="space-y-4">
                  <Label>Select Profile Picture</Label>
                  <div className="flex flex-wrap gap-4">
                    {AVATAR_OPTIONS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setFormData({ ...formData, avatar_url: url })}
                        className={cn(
                          "rounded-full p-1 border-2 transition-all",
                          formData.avatar_url === url ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={url} />
                        </Avatar>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social">Social Link (e.g. Instagram, LinkedIn)</Label>
                    <Input 
                      id="social" 
                      placeholder="https://..."
                      value={formData.social_link} 
                      onChange={(e) => setFormData({...formData, social_link: e.target.value})} 
                    />
                  </div>
                </div>

                <Button className="w-full sm:w-auto" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            ) : (
              /* VIEW MODE UI */
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 mt-4 border-t border-border">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">Full Name</label>
                    <p className="text-foreground font-medium">{user.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">Email</label>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-foreground/50">Joined</label>
                    <p className="text-foreground font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SAVED CALCULATORS LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <History className="w-5 h-5" /> My Courses
                </h3>
                <div className="space-y-2">
                    {fetchingCalcs ? (
                        <p className="text-sm text-muted-foreground">Loading courses...</p>
                    ) : savedCalculators.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
                            No saved courses yet.
                        </div>
                    ) : (
                        savedCalculators.map((calc) => (
                            <button
                                key={calc.id}
                                onClick={() => setSelectedCalc(calc)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group",
                                    selectedCalc?.id === calc.id 
                                        ? "bg-primary text-primary-foreground border-primary" 
                                        : "bg-card hover:bg-accent border-border"
                                )}
                            >
                                <span className="truncate font-medium">{calc.course_name}</span>
                                <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", selectedCalc?.id === calc.id && "opacity-100")} />
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* CALCULATOR DISPLAY AREA */}
            <div className="lg:col-span-3">
                {selectedCalc ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Active: {selectedCalc.course_name}</h2>
                            <p className="text-xs text-muted-foreground">Saved on {new Date(selectedCalc.created_at).toLocaleDateString()}</p>
                        </div>
                        <GradeCalculator data={selectedCalc.syllabus_data} />
                    </div>
                ) : (
                    <Card className="border-dashed border-2 bg-card/30 flex flex-col items-center justify-center p-12 text-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                        <CardTitle className="mb-2">No Course Selected</CardTitle>
                        <CardDescription className="max-w-xs">
                            Select one of your saved courses from the sidebar to view and edit your grades.
                        </CardDescription>
                        <Button variant="outline" className="mt-6" onClick={() => navigate('/ai')}>
                            Create New Calculator
                        </Button>
                    </Card>
                )}
            </div>
        </div>
      </div>
    </>
  );
}