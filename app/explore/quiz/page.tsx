import { PathFinderQuiz } from "@/components/quiz/path-finder-quiz";
import { PageHeading } from "@/components/shared/page-heading";

export default function QuizPage() {
  return (
    <>
      <PageHeading title="Path Finder Quiz" />
      <PathFinderQuiz />
    </>
  );
}
