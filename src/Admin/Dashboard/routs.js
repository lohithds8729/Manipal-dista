import Dashboard from "../Dashboard";
import { CDRsFetched } from "../../Admin/Pages/CDRsFetched";
import { CRMSyncFailure } from "../../Admin/Pages/CRMSyncFailure";
import {SyncSuccessRecord} from "../../Admin/Pages/SyncSuccessRecord";

export const protectedDashboardRoutes = [
  

  { path: "/admin", element: <Dashboard /> },
  { path: "/cdrsfetched", element: <CDRsFetched /> },
  { path: "/crmsyncfailure", element: <CRMSyncFailure /> },
  { path: "/syncsuccessrecord", element: <SyncSuccessRecord /> },

];
