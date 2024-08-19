export async function generateMetadata() {
  return {
    title: 'User Profile',
  };
}

const UserProfilePage = () => {
  return (
    <div className="mx-auto my-6 flex w-full items-center justify-center">
      User profile
    </div>
  );
};

export default UserProfilePage;
