import { Suspense } from "react";
import QuestLunchApp from "@/components/quest-lunch-app";

export default function Page() {
  return <Suspense fallback={null}><QuestLunchApp /></Suspense>;
}
