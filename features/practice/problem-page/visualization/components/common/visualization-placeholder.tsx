import { CodeXml } from 'lucide-react';

export function VisualizationPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center select-none">
      <div className="mb-4 text-neutral-600"> 
        <CodeXml size={80}/>
      </div>

      <h3 className="text-base font-medium text-neutral-300">
        Ready to Visualize
      </h3>
      <p className="mt-1.5 max-w-xs text-xs text-neutral-500 leading-relaxed">
        Run your code to render the step-by-step trace and data structure visualization here.
      </p>
    </div>
  );
};