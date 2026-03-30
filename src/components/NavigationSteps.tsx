import { ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { NavigationStep } from '../data/locations';

interface NavigationStepsProps {
  steps: NavigationStep[];
}

export const NavigationSteps = ({ steps }: NavigationStepsProps) => {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-all hover:shadow-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {index === steps.length - 1 ? (
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Step {index + 1}
                </h3>
                {step.distance && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {step.distance}
                  </span>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{step.instruction}</p>
              {step.landmark && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  {step.landmark}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
