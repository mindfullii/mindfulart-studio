import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function WriteForUsPage() {
  return (
    <main className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading mb-6">Write for MindfulArt Studio</h1>
          <p className="text-lg text-text-secondary mb-12">
            Share your insights and experiences with our community of mindful artists. We're always looking for fresh perspectives on art, mindfulness, and creativity.
          </p>

          <div className="space-y-12">
            {/* What We're Looking For */}
            <section>
              <h2 className="text-2xl font-heading mb-6">What We're Looking For</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Art & Creativity',
                    description: 'Techniques, inspiration, and creative processes in various art forms'
                  },
                  {
                    title: 'Mindfulness Practices',
                    description: 'Incorporating mindfulness into artistic practice and daily life'
                  },
                  {
                    title: 'Digital Art',
                    description: 'AI art, digital tools, and the future of creative expression'
                  },
                  {
                    title: 'Personal Stories',
                    description: 'Your journey with art, mindfulness, and personal growth'
                  }
                ].map((topic, index) => (
                  <div key={index} className="bg-card rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">{topic.title}</h3>
                    <p className="text-text-secondary">{topic.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Guidelines */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Submission Guidelines</h2>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-3">Article Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li>Original, unpublished content</li>
                    <li>800-2000 words in length</li>
                    <li>Clear, engaging writing style</li>
                    <li>Relevant images or illustrations (if applicable)</li>
                    <li>Personal insights and practical takeaways</li>
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-3">Style Guide</h3>
                  <ul className="list-disc list-inside space-y-2 text-text-secondary">
                    <li>Use clear, conversational language</li>
                    <li>Include relevant examples and personal experiences</li>
                    <li>Break content into scannable sections</li>
                    <li>Include a compelling introduction and conclusion</li>
                    <li>Properly attribute any quotes or references</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Submit */}
            <section>
              <h2 className="text-2xl font-heading mb-6">How to Submit</h2>
              <div className="bg-card rounded-lg p-6">
                <p className="text-text-secondary mb-6">
                  To submit your article, please send an email to <span className="text-primary">write@mindfulart.studio</span> with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary mb-6">
                  <li>Your name and brief bio</li>
                  <li>Article title and outline</li>
                  <li>Previous writing samples (if available)</li>
                  <li>Your social media handles (optional)</li>
                </ul>
                <p className="text-text-secondary">
                  We aim to respond to all submissions within 5 business days.
                </p>
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-2xl font-heading mb-6">Benefits of Writing for Us</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Exposure',
                    description: 'Reach our growing community of mindful artists and creators'
                  },
                  {
                    title: 'Compensation',
                    description: 'Competitive rates for accepted articles'
                  },
                  {
                    title: 'Platform Credits',
                    description: 'Free credits to use on our platform'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="bg-card rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                    <p className="text-text-secondary">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="text-center">
              <p className="text-text-secondary mb-6">
                Ready to share your voice with our community?
              </p>
              <Button asChild size="lg">
                <a href="mailto:write@mindfulart.studio">Submit Your Article</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
} 