import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-dashed border-border ">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:text-left">
          {/* Brand & CTA Section */}
          <div className="space-y-4 flex flex-col md:items-start">
            <h3 className="text-xl font-bold tracking-tight">Grade Calculator</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Unlock your full academic potential! Create an account to save your grades, 
              track progress over time, and access our advanced AI assistant.
            </p>
            <div className="pt-2">
              <Link
                to="/signup"
                className="w-full md:w-auto"
              ><Button 
              variant="default" 
              size="default" 
              className="w-full md:w-auto"
              >
                Sign Up Now
              </Button></Link>
            </div>
          </div>
          {/* Navigation Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">Calculator</Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-foreground transition-colors">AI Tool</Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
              </li>
              <li>
                <Link to="/final-grades" className="hover:text-foreground transition-colors">Final Grades</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-foreground transition-colors">My Profile</Link>
              </li>
            </ul>
          </div>

          {/* Socials Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Socials</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://t.me/Adlkhy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex gap-2 hover:text-foreground transition-colors md:justify-start"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col md:items-start">
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link to="/term-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/term-of-service" className="hover:text-foreground transition-colors">Rights & Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Evalis. Made by <a href="https://t.me/Adlkhy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">Adilkhan</a>.</p>
          <div className="flex gap-6">
            <Link to="/term-of-service" className="hover:text-foreground transition-colors">Rights Page</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
