import { Header } from '@/components/home/Header';
import { AboutSection } from '@/components/home/AboutSection';
import { ProjectArea } from '@/components/home/ProjectArea';
import { TeamMember } from '@/components/home/TeamMember';
import { GoalsSection } from '@/components/home/GoalsSection';

export default function Home() {
  return (
    <main>
      <Header />
      <AboutSection />
      <ProjectArea />
      <TeamMember />
      <GoalsSection />
    </main>
  );
}