// Bu dosya sadece bir köprü görevi görür.
// app/profile rotası çağrıldığında, src içindeki ekranı gösterir.

import ProfileScreen from "./src/screens/ProfileScreen";

export default function profile() {
  return <ProfileScreen />;
}
