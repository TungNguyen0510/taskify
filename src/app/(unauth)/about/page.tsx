export async function generateMetadata() {
  return {
    title: 'About - Taskify',
    description: 'Description of the Taskify application"',
  };
}

export default function About() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] justify-center">
      <p>
        Welcome to our About page! We are a team of passionate individuals
        dedicated to creating amazing software.
      </p>
    </div>
  );
}
