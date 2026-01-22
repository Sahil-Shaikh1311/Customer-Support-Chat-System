import { Link } from "react-router-dom";
import {
  MessageSquare,
  ArrowRight,
  Zap
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      <header className="relative z-10 ">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between ">
          
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              SupportHub
            </span>
          </div>

         
          <Link to="/login">
            <button className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-teal-600 transition">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </nav>
      </header>

   
      <main className="relative z-10 container mx-auto px-6 pt-20 text-center">

       
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Real-time customer support platform
        </div>

        
        <h1 className="text-4xl md:text-6xl font-bold text-teal-900 leading-tight">
          Deliver{" "}
          <span className="text-teal-500">exceptional</span>{" "}
          customer <br className="hidden md:block" />
          support
        </h1>

       
        <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
          A modern, real-time chat platform built for businesses that care
          about their customers. Connect instantly and resolve issues faster.
        </p>

        <div className="mt-8 flex justify-center gap-4">
         <Link to="/login">
             <button className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-white font-medium shadow hover:bg-teal-600 transition">
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </button>
         </Link>

        </div>

      
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold  text-teal-700">99.9%</h3>
            <p className="text-gray-500 mt-1">Uptime</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-teal-900">&lt;1s</h3>
            <p className="text-gray-500 mt-1">Response Time</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-teal-900">10K+</h3>
            <p className="text-gray-500 mt-1">Active Users</p>
          </div>
        </div>
      </main>
    </div>
  );
}
