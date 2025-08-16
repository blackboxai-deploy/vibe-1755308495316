import TodoApp from '@/components/TodoApp';

export default function HomePage() {
  return (
    <main>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Todo List
        </h1>
        <p className="text-lg text-gray-600">
          Stay organized and get things done
        </p>
      </div>
      <TodoApp />
    </main>
  );
}