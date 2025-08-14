import { CourseForm } from "@/features/courses/components/CouseForm";
import { PageHeader } from "@/components/PageHeader";

export default function NewCoursesPage() {
  return (
    <div className="container my-6">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
