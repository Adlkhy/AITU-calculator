import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Navbar08 } from '@/components/Navbar2';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';
import { supabase } from '@/lib/supabaseClient';
import { cn } from "@/lib/utils"; // shadcn utility

// 1. Define your provided photos
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

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    social_link: ''
  });

  const game = [[14, 7, 0, 8, 6, 13, 20], [14, 7, 13, 20, 16, 27, 21], [14, 20, 27, 21, 34, 24, 28], [27, 21, 34, 28, 41, 32, 35], [34, 28, 41, 35, 48, 40, 42], [34, 28, 41, 35, 48, 42, 46], [34, 28, 41, 35, 48, 42, 38], [34, 28, 41, 35, 48, 30, 21], [34, 28, 41, 48, 21, 22, 14], [34, 28, 41, 21, 14, 16, 27], [34, 28, 21, 14, 10, 20, 27], [28, 21, 14, 4, 13, 20, 27], [28, 21, 14, 12, 6, 13, 20], [28, 21, 14, 6, 13, 20, 11], [28, 21, 14, 6, 13, 20, 10], [14, 6, 13, 20, 9, 7, 21]];

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
    }
  }, [user, loading, navigate]);

  const handleSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.full_name, 
          avatar_url: formData.avatar_url,
          social_link: formData.social_link 
        }
      });
      if (error) throw error;

      console.log("Saved Data:", formData);
      setIsEditing(false);
      // Optional: Refresh page or show success toast
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex items-center gap-5 rounded px-4 py-3">
          <DotLoader frames={game} className='gap-0.5' color="primary" duration={150} isPlaying={true} dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' />
          <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar08 />
      <div className="text-foreground min-h-screen font-sans px-4 sm:px-8 pb-20">
        <Card className='max-w-4xl mx-auto my-8'>
          <CardContent>
            <CardTitle className="text-3xl text-center mb-2 mt-4 sm:mt-6">
              Welcome back, {user.user_metadata?.full_name || 'User'}!
            </CardTitle>
            <CardDescription className="text-center text-foreground/70 text-base mb-4 sm:mb-6">
              Manage your profile and access your grade calculators.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto bg-card p-4 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-2xl text-foreground">Profile Details</CardTitle>
            <Button 
              variant={isEditing ? "outline" : "default"} 
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <CardContent className="space-y-8 px-0">
            {isEditing ? (
              /* EDIT MODE UI */
              <div className="space-y-6">
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

                <Button className="w-full sm:w-auto" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            ) : (
              /* VIEW MODE UI */
              <>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={user.user_metadata?.avatar_url || AVATAR_OPTIONS[0]} alt='Avatar' />
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">
                      {user.user_metadata?.full_name || 'No name set'}
                    </h2>
                    <p className="text-foreground/60">{user.email}</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border">
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

        {/* BOTTOM SECTION: CALCULATOR PLACEHOLDER */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="border-dashed border-2 bg-card/50">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Selected Subject Calculator</h2>
              <div className="bg-background/50 rounded-lg p-10 flex flex-col items-center justify-center border">
                <p className="text-foreground/60 italic text-center">
                  Your active calculator for [Selected Subject] will be displayed here. 
                  <br />
                  <span className="text-sm">(Calculator Component - Coming Soon)</span>
                </p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                  Go to Main Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}