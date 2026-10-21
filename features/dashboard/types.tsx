import { LucideIcon } from "lucide-react";

export type ActivityLog = {
  id: string;
  action_type: string;
  action_id: string;
  completed: boolean;
  created_at: string;
};

export type ActivityItem = ActivityLog & {
  title: string;
  category: string;
  icon: LucideIcon;
  iconColor: string;
  activityLabel: string;
};
