import clinicLogo from '../../WhatsApp Image 2026-10-16 at 3.33.55 PM.jpeg';

export function ClinicLogo({ className }: { className: string }) {
  return <img src={clinicLogo} alt="Shivansh Optical and Eye Clinic" className={className} />;
}