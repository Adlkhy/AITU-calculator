import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="text-foreground min-h-screen font-sans p-4 mb-8 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-foreground mb-6">Terms of Service for Evalis</h1>
        <h3 className="text-base font-semibold mb-4">Effective Date: {new Date().getFullYear()}</h3>
        
        <div className="space-y-6 text-foreground">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Welcome</h2>
            <p>Welcome to Evalis. By accessing or using Evalis, you agree to the following Terms of Service. Please read them carefully.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Description of the Service</h2>
            <p>Evalis is a web platform that allows users to:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Calculate their final grades based on provided inputs.</li>
              <li>Access personalized features such as saved grade data.</li>
              <li>Participate in leaderboards that compare performance between users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. User Accounts</h2>
            <p>To use certain features of Evalis, you may need to create a user account.</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. What We Collect</h2>
            <p>We collect the following, but are not limited to:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Your email address, username</li>
              <li>Your final grades (the core currency of my website)</li>
              <li>Your existential dread when you input that grade (we have a special algorithm for this)</li>
              <li>Your soul. Ha-ha-ha.. I am just kidding, or was I?</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. What We Do With Your Data</h2>
            <p>Specifically, we use it to:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Populate the leaderboards, so we can all collectively witness your triumphs and failures</li>
              <li>Display personalized results.</li>
              <li>Sell to absolutely no one. This is my personal project. Trust me bro.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. The Social Contract</h2>
            <p>You agree to input your <span className="font-semibold">*real, actual, final grades*</span>. Inputting a fake grade is a violation of this contract and the natural order. The punishment is not a ban. The punishment is the silent, eternal judgment of your peers and my disappointment in you, then execution (your account or you whatever).</p>
            <p>You agree not to attempt to <span className="font-semibold">exploit, hack, or reverse-engineer</span> the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
            <p>All content, design, code, and branding on Evalis are the property of Evalis unless otherwise stated. Users may not copy, redistribute, or modify the platform without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Our Liability</h2>
            <p>Let's be clear. This is a final grade calculator. If the website spontaneously combusts, takes your grade with it, and causes you to have a minor emotional breakdown, that's on you. We are not liable for:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Inaccurate calculations (did <span className="font-semibold">you</span> put in the right numbers?)</li>
              <li>Existential crises triggered by seeing your classmate at the top of the leaderboard</li>
              <li>Any third-party actions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. The Fine Print</h2>
            <p>By clicking "Login" or "Sign Up", you hereby:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Grant me perpetual, irrevocable rights to use your grade data to create sick graphs and charts for my portfolio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Termination</h2>
            <p>I can terminate your access at any time, for any reason, or for no reason at all. Maybe I don't like your email address. Maybe your grades are too good and you're making the rest of us look bad. It's a vibe check, and I'm the only one who gets to administer it.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
