import { Container } from '@/components/ui/Container';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gray-50">
        <Container className="h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading mb-6">
              About MindfulArt Studio
            </h1>
            <p className="text-lg text-text-secondary">
              Empowering artists to explore mindfulness through creative expression
            </p>
          </div>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading mb-6">Our Mission</h2>
            <div className="prose prose-lg">
              <p>
                At MindfulArt Studio, we believe in the transformative power of combining art with mindfulness. 
                Our platform is designed to help artists and enthusiasts explore their creativity while maintaining 
                a mindful approach to their practice.
              </p>
              <p>
                We provide a space where traditional artistic techniques meet modern technology, 
                creating unique opportunities for artistic expression and personal growth.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/about/mission.jpg"
              alt="Artist working in studio"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </Container>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <Container>
          <h2 className="text-3xl font-heading mb-12 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Mindful Creation',
                description: 'We encourage artists to approach their work with presence and intention.'
              },
              {
                title: 'Community',
                description: 'Building a supportive environment where artists can connect and grow together.'
              },
              {
                title: 'Innovation',
                description: 'Embracing new technologies while respecting traditional artistic practices.'
              },
              {
                title: 'Accessibility',
                description: 'Making art and mindfulness practices accessible to everyone.'
              },
              {
                title: 'Quality',
                description: 'Maintaining high standards in both artistic output and user experience.'
              },
              {
                title: 'Sustainability',
                description: 'Promoting sustainable practices in art creation and business operations.'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-heading mb-3">{value.title}</h3>
                <p className="text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Team Section */}
      <Container className="py-16">
        <h2 className="text-3xl font-heading mb-12 text-center">Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Sarah Chen',
              role: 'Founder & Creative Director',
              image: '/images/about/team/sarah.jpg'
            },
            {
              name: 'Michael Wong',
              role: 'Head of Technology',
              image: '/images/about/team/michael.jpg'
            },
            {
              name: 'Emma Davis',
              role: 'Community Manager',
              image: '/images/about/team/emma.jpg'
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-heading mb-1">{member.name}</h3>
              <p className="text-text-secondary">{member.role}</p>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
} 