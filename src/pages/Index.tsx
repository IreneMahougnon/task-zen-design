
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the task manager app
    window.location.href = '/login.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirection vers TaskZen...</h1>
        <p className="text-xl text-muted-foreground">Chargement de votre gestionnaire de tâches</p>
      </div>
    </div>
  );
};

export default Index;
