import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getServerMe();

  return {
    title: `${user.username} — Profile | NoteHub`,
    description: `Profile of ${user.username} — manage your notes on NoteHub`,
    openGraph: {
      title: `${user.username} — Profile | NoteHub`,
      description: `Profile of ${user.username} — manage your notes on NoteHub`,
      url: "https://your-domain.com/profile",
      siteName: "NoteHub",
      images: [
        {
          url:
            user.avatar ||
            "https://ac.goit.global/fullstack/react/default-avatar.jpg",
          width: 1200,
          height: 630,
          alt: `${user.username} avatar`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.username} — Profile | NoteHub`,
      description: `Profile of ${user.username} — manage your notes on NoteHub`,
      images: [
        user.avatar ||
          "https://ac.goit.global/fullstack/react/default-avatar.jpg",
      ],
    },
  };
}
export default async function ProfilePage() {
  const user = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
