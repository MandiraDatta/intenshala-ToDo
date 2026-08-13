import Sidebar from "@/components/sidebar";

export default function Dashboard() {
    return (
        <div className="min-h-screen flex">
          
        {/*sidebar*/}
        <Sidebar />
           {/*main content*/}
           <main className="flex-1 min-w-0 ">
            main area
           </main>
        </div>
    );
}