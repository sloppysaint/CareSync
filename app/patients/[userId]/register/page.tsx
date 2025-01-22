import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';
import Image from 'next/image';

interface RegisterProps {
  params: { userId: string };
}

const Register = async ({ params }: RegisterProps) => {
  try {
    const resolvedParams = await params; // Await params before destructuring
    const { userId } = resolvedParams;

    // Fetch user details
    const user = await getUser(userId);

    return (
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container">
          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
            {/* Pass fetched user to the RegisterForm */}
            <RegisterForm user={user} />

            <p className="copyright py-5">© 2025 CarePulse</p>
          </div>
        </section>
        <Image
          src="/assets/images/register-img.png"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img max-w-[400px]"
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading register page:', error);
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Failed to load user data. Please try again.</p>
      </div>
    );
  }
};

export default Register;
