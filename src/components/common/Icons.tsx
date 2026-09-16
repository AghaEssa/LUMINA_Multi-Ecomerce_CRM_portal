"use client";

import {
  Shirt,
  Armchair,
  Utensils,
  Stethoscope,
  Sparkles,
  Apple,
  Smartphone,
  Car,
  Search,
  ShoppingCart,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  Star,
  Check,
  X,
  Menu,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  ArrowRight,
  ChevronDown,
  Sparkle,
  Zap,
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Layers,
  BarChart3,
  Users,
  Package,
  Trash2,
} from "lucide-react";

export const Icons = {
  Shirt,
  Armchair,
  Utensils,
  Stethoscope,
  Sparkles,
  Apple,
  Smartphone,
  Car,
  Search,
  ShoppingCart,
  Sun,
  Moon,
  ChevronRight,
  Filter,
  Star,
  Check,
  X,
  Menu,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  ArrowRight,
  ChevronDown,
  Sparkle,
  Zap,
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Layers,
  BarChart3,
  Users,
  Package,
  Trash2,
};

export type IconName = keyof typeof Icons | string;

export function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const normalizedName = name as keyof typeof Icons;
  const Component = Icons[normalizedName] || LayoutGrid;
  return <Component className={className} />;
}
