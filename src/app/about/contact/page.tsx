import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';

export default function ContactPage() {
  return (
    <main className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading mb-6">Contact Us</h1>
          <p className="text-lg text-text-secondary mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Your message..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-heading mb-4">Other Ways to Connect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <p className="text-text-secondary">support@mindfulart.studio</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Social Media</h4>
                    <div className="flex space-x-4">
                      <a href="#" className="text-text-secondary hover:text-primary">
                        Twitter
                      </a>
                      <a href="#" className="text-text-secondary hover:text-primary">
                        Instagram
                      </a>
                      <a href="#" className="text-text-secondary hover:text-primary">
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-heading mb-4">FAQ</h3>
                <p className="text-text-secondary mb-4">
                  Find quick answers to common questions in our FAQ section.
                </p>
                <Button variant="outline" asChild>
                  <a href="/about/faq">Visit FAQ</a>
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-heading mb-4">Business Hours</h3>
                <div className="space-y-2 text-text-secondary">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
} 