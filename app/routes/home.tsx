import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { redirect } from "react-router";
import { useState } from "react";
import { authService } from "../services/authService";
// import { customerService } from "../services/customerService";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {

  let user = await authService.getCurrentUser();
  if (!user) {
    return redirect("/login");
  }

  // const [customers, setCustomers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // try {
  //   // Check if user is authenticated
  //   const user = authService.getCurrentUser();
  //   if (!user || !user.token) {
  //     redirect('/login');
  //     return;
  //   }
  //   // const data = await customerService.getCustomers(100);
  //   // setCustomers(data);
  // } catch (err) {
  //   setError(err.message || 'Failed to fetch customers');
  // } finally {
  //   setLoading(false);
  // }
  return <Welcome />;
}

export default function Home() {
  return loader;
}
