interface AppNavItems {
  key: number;
  name: string;
  where: string;
}

export const appNavItems: AppNavItems[] = [
  {
    key: 1,
    name: "Dashboard",
    where: "/userdashboard",
  },
  {
    key: 2,
    name: "Job Openings",
    where: "/jobopenings",
  },
  {
    key: 3,
    name: "My Profile",
    where: "/profile",
  },
];
