import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="container mx-auto py-12 max-w-5xl">
      <Helmet>
        <title>About TypeArts | The Global Art Marketplace</title>
        <meta name="description" content="Learn about TypeArts, the premiere global marketplace connecting artists and collectors through innovative technology and a passion for art." />
      </Helmet>
      
      <div className="space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">About TypeArts</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting artists and collectors through innovation and passion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              TypeArts was founded on a simple but powerful idea: to create meaningful connections between artists and art lovers worldwide through technology.
            </p>
            <p className="text-muted-foreground mb-4">
              We believe that art has the power to transform spaces, inspire ideas, and connect people across cultures. Our mission is to make exceptional art accessible to everyone while providing artists with the platform they deserve.
            </p>
            <Link to="/mission" className="inline-flex items-center gap-1 text-primary font-medium hover:underline mt-3">
              Read our complete mission statement
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 aspect-square flex items-center justify-center">
            <div className="text-5xl font-bold text-primary/80 text-center leading-tight">
              Bridging art<br />and technology<br />since 2023
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AR Preview</h3>
              <p className="text-muted-foreground">
                Experience artwork in your own space before you buy with our advanced augmented reality technology.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
              <p className="text-muted-foreground">
                Discover new artists and pieces that match your unique taste with our intelligent recommendation engine.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-muted-foreground">
                Buy and sell with confidence through our secure payment processing and trusted shipping partners.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Elena García", role: "Founder & CEO", image: "https://i.pravatar.cc/150?img=32" },
              { name: "Marcus Wei", role: "Chief Technology Officer", image: "https://i.pravatar.cc/150?img=60" },
              { name: "Priya Sharma", role: "Head of Artist Relations", image: "https://i.pravatar.cc/150?img=23" },
              { name: "James Bennett", role: "Lead Designer", image: "https://i.pravatar.cc/150?img=52" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-32 h-32 mx-auto border-4 border-primary/20">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <div className="bg-card p-8 rounded-2xl border mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Artistic Integrity</h3>
              <p className="text-muted-foreground">
                We respect the vision and rights of all artists, ensuring their work is presented and sold with integrity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                We celebrate diversity in art and culture, bringing together creators and collectors from all corners of the world.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously push the boundaries of technology to enhance the experience of discovering and enjoying art.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                We are committed to sustainable practices in our operations and encourage environmentally conscious art.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Whether you're an artist looking to showcase your work or a collector searching for your next conversation piece, we invite you to join our growing community.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Join as an Artist
            </button>
            <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-colors">
              Start Collecting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}