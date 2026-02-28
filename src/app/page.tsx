import { Hero } from '@/components/home/Hero';
import { AboutSection } from '@/components/home/AboutSection';
import { ProjectArea } from '@/components/home/ProjectArea';
import { TeamMember } from '@/components/home/TeamMember';
import { GoalsSection } from '@/components/home/GoalsSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ProjectArea />
      <TeamMember />
      <GoalsSection />
    </main>
  );
}