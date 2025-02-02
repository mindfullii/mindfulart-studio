import { Container } from '@/components/ui/Container';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main>
      {/* Spacer Container */}
      <Container className="h-24">
        <div />
      </Container>

      {/* Content Section */}
      <Container className="py-16">
      <div className="grid md:grid-cols-2 gap-12">
          {/* Text Column */}
          <div className="space-y-8">
            {/* Who We Are Section */}
            <div>
              <h2 className="text-4xl font-heading mb-12">Who We Are</h2>
              <div className="prose prose-lg">
                <p>
                  At MindfulArt Studio, we believe in the transformative power of combining art with mindfulness. 
                </p>
                <p></p>
                <p>
                  Our platform serves as a digital sanctuary where technology meets artistic expression, helping you create conscious touchpoints that anchor peace in your daily life.
                </p>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* Section 1 */}
              <details className="group transition-all duration-300 ease-in-out">
                <summary className="flex cursor-pointer items-center py-2 hover:text-primary transition-colors">
                  <span className="mr-2 text-xl transition-transform duration-200">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                  <h5 className="text-xl font-heading">Your quiet harbor at fingertips</h5>
                </summary>
                <div className="pl-7 pt-2 prose prose-lg opacity-90 transform transition-all duration-300 ease-in-out">
                  <p>In this fast-paced world,<br/>
                  your sanctuary is just a touch away.<br/>
                  A digital space that opens instantly,<br/>
                  whenever you need a moment of peace.</p>
                </div>
              </details>

              {/* Section 2 */}
              <details className="group transition-all duration-300 ease-in-out">
                <summary className="flex cursor-pointer items-center py-2 hover:text-primary transition-colors">
                  <span className="mr-2 text-xl transition-transform duration-200">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                  <h5 className="text-xl font-heading">Your companion in creating mindful art anchors</h5>
                </summary>
                <div className="pl-7 pt-2 prose prose-lg opacity-90 transform transition-all duration-300 ease-in-out">
                  <p>We help you create art infused with mindful presence,<br/>
                  each piece resonating with inner peace.<br/>
                  These mindful artworks become your daily companions,<br/>
                  gently guiding you back to moments of serenity.</p>
                </div>
              </details>

              {/* Section 3 */}
              <details className="group transition-all duration-300 ease-in-out">
                <summary className="flex cursor-pointer items-center py-2 hover:text-primary transition-colors">
                  <span className="mr-2 text-xl transition-transform duration-200">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                  <h5 className="text-xl font-heading">Your sanctuary space of emotions</h5>
                </summary>
                <div className="pl-7 pt-2 prose prose-lg opacity-90 transform transition-all duration-300 ease-in-out">
                  <p>In this space of artistic resonance,<br/>
                  raw emotions transform into healing expression.<br/>
                  Through each creation, feelings find their voice,<br/>
                  painting a journey of inner restoration.</p>
                </div>
              </details>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative aspect-[3/2] shadow-lg rounded-lg overflow-hidden transform transition-shadow duration-300 hover:shadow-xl">
            <Image
              src="/images/about/mission.jpg"
              alt="Artist working in studio"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

    </main>
  );
} 