// import AuthLayout from "layouts/AuthLayout.vue";

import membershipCode from "pages/membership/CodesIndex.vue";
import membershipPlan from "pages/membership/PlansIndex.vue";
import branchIndex from "pages/branches/BranchIndex.vue";
import ProductIndex from "pages/branches/ProductIndex.vue";
import branchCashierIndex from "pages/branches/CashierIndex.vue";
import branchCashierCreate from "pages/branches/cashier/CreateCashier.vue";
import discountIndex from "pages/branches/DiscountIndex.vue";
import monitoringIndex from "pages/branches/MonitorIndex.vue";
import settingsIndex from "pages/settingsIndex.vue";
import ProductIndexVue from "pages/products/ProductIndex.vue";
import ThemeColorPage from "pages/ThemeColorIndex.vue";
import CompanyIndex from "pages/company/CompanyIndex.vue";
import CompanyCreate from "pages/company/CreateCompany.vue";
import CompanyOwner from "pages/users/owner/OwnerIndex.vue";
import CashierIndex from "pages/cashier/CashierIndex.vue";
import CashierCreate from "pages/cashier/createCashier.vue";
import ServiceIndex from "pages/branches/ServiceIndex.vue";
import branchStaffIndex from "pages/branches/StaffIndex.vue";
import accountIndex from "pages/profile/ProfileIndex.vue";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "dashboard",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "cashier", "manager", "member", "owner"],
    },
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/IndexPage.vue"),
        name: "dashboard",
      },
      {
        path: "/:slug/dashboard",
        component: () => import("pages/IndexPage.vue"),
        name: "dashboard-index",
        access: ["super-admin", "owner", "cashier", "barber"],
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "product-index",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: "/:slug/products",
        // component: () => ProductIndexVue,
        component: () => import("pages/products/ProductIndex.vue"),
        name: "product-index",
        access: ["super-admin", "owner"],
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "supplies",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: ":slug/supplies",
        component: () => import("pages/supplies/SupplyIndex.vue"),
        name: "supply-index",
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "inventory",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: "/inventory",
        component: () => import("pages/supplies/SupplyIndex.vue"),
        name: "inventory-index",
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "supplier",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: ":slug/supplier",
        component: () => import("pages/supplier/SupplierIndex.vue"),
        name: "supplier-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner"],
        },
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "order",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: ":slug/order",
        component: () => import("pages/order/OrderIndex.vue"),
        name: "order-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner"],
        },
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "setting-index",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: ":slug/settings",
        // component: () => settingsIndex,
        component: () => import("pages/settingsIndex.vue"),
        name: "setting-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner"],
        },
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "voucher",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "admin"],
    },
    children: [
      {
        path: "/voucher",
        component: () => import("pages/supplier/SupplierIndex.vue"),
        name: "voucher-index",
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "inventory",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "admin"],
    },
    children: [
      {
        path: ":slug/inventory",
        component: () => import("pages/inventories/InventoryIndex.vue"),
        name: "inventory-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner"],
        },
      },
    ],
  },
  {
    path: "/user",
    component: () => import("layouts/MainLayout.vue"),
    name: "users",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "manager"],
    },
    children: [
      {
        path: "/user/members",
        component: () => import("pages/users/member/MemberIndex.vue"),
        name: "member-index",
      },
      {
        path: "/user/members/:id/update-photo",
        component: () => import("pages/users/member/MemberCaptureImage.vue"),
        name: "member-capture",
      },
      {
        path: "/user/staff",
        component: () => import("pages/users/staff/StaffIndex.vue"),
        name: "staff-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin"],
        },
      },
    ],
  },

  // {
  //   path: "/membership/",
  //   component: () => import("layouts/MainLayout.vue"),
  //   name: "membership",
  //   meta: {
  //     requiredAuth: true,
  //     access: ["super-admin"],
  //   },
  //   children: [
  //     {
  //       path: "/membership/codes",
  //       component: membershipCode,
  //       name: "membership-codes",
  //     },
  //     {
  //       path: "/membership/plans",
  //       component: membershipPlan,
  //       name: "membership-plans",
  //     },
  //   ],
  // },
  {
    path: "/plans",
    component: () => import("layouts/MainLayout.vue"),
    name: "membership",
    meta: {
      requiredAuth: true,
      access: ["super-admin"],
    },
    children: [
      {
        path: "/plans",
        component: membershipPlan,
        name: "membership-plans",
      },
    ],
  },

  {
    path: "/cashier",
    component: () => import("layouts/MainLayout.vue"),
    name: "cashier",
    meta: {
      requiredAuth: true,
      access: ["super-admin"],
    },
    children: [
      {
        path: "/cashier",
        component: CashierIndex,
        name: "cashier-index",
      },
    ],
  },
  {
    path: "/cashier/create",
    component: () => import("layouts/CashierLayout.vue"),
    name: "cashier-create",
    meta: {
      requiredAuth: true,
      access: ["super-admin"],
    },
    children: [
      {
        path: "/cashier/create",
        component: CashierCreate,
        name: "cashier-create",
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/CashierLayout.vue"),
    name: "branch-cashier-create",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner", "manager", "cashier"],
    },
    children: [
      {
        path: "/:slug/branches/:id/cashier/create",
        component: branchCashierCreate,
        name: "branch-cashier-create",
      },
    ],
  },
  {
    path: "/companies",
    component: () => import("layouts/MainLayout.vue"),
    name: "company",
    meta: {
      requiredAuth: true,
      access: ["super-admin"],
    },
    children: [
      {
        path: "/company",
        component: CompanyIndex,
        name: "company-index",
      },
      {
        path: "/company/create",
        component: CompanyCreate,
        name: "company-create",
      },
      {
        path: "/company/:slug/owner",
        component: CompanyOwner,
        name: "company-owner",
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "branches",
    meta: {
      requiredAuth: true,
      access: ["super-admin", "owner"],
    },
    children: [
      {
        path: ":slug/branches",
        component: branchIndex,
        name: "branch-index",
      },
      {
        path: ":slug/branches/:id/staff",
        component: branchStaffIndex,
        name: "branch-staff-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner"],
        },
      },
      // {
      //   path: ":slug/branches/:id/products",
      //   component: productIndex,
      //   name: "product-branch-index",
      //   meta: {
      //     requiredAuth: true,
      //     access: ["super-admin", "owner", "manager"],
      //   },
      // },

      {
        path: "/:slug/branches/:id/cashier",
        component: branchCashierIndex,
        name: "branch-cashier-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner", "manager", "cashier"],
        },
      },
      {
        path: "/:slug/branches/:id/discount",
        component: discountIndex,
        name: "discount-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner", "manager"],
        },
      },

      {
        path: "/:slug/branches/:id/services",
        component: ServiceIndex,
        name: "service-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner", "manager"],
        },
      },

      {
        path: "/:slug/branches/:id/products",
        component: ProductIndex,
        name: "branch-product-index",
        meta: {
          requiredAuth: true,
          access: ["super-admin", "owner", "manager", "cashier"],
        },
      },
      // {
      //   path: ":slug/branches/:id/monitoring",
      //   component: monitoringIndex,
      //   name: "monitoring-index",
      //   meta: {
      //     requiredAuth: true,
      //     access: ["super-admin", "cashier", "manager"],
      //   },
      // },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    name: "accounts",
    meta: {
      requiredAuth: true,
      access: [
        "super-admin",
        "owner",
        "manager",
        "member",
        "barber",
        "cashier",
      ],
    },
    children: [
      {
        path: "/:slug/accounts",
        component: accountIndex,
        name: "account",
        meta: {
          requiredAuth: true,
          access: [
            "super-admin",
            "owner",
            "manager",
            "member",
            "barber",
            "cashier",
          ],
        },
      },
    ],
  },

  // {
  //   path: "/settings/",
  //   component: () => import("layouts/MainLayout.vue"),
  //   name: "settings",
  //   meta: {
  //     requiredAuth: true,
  //     access: ["super-admin"],
  //   },
  //   children: [
  //     {
  //       path: "/settings/",
  //       component: settingsIndex,
  //       name: "settings",
  //     },
  //     {
  //       path: "/settings/themes",
  //       component: ThemeColorPage,
  //       name: "settings-theme-colors",
  //     },
  //   ],
  // },
  {
    path: "/",
    redirect: "/login",
    component: () => import("layouts/AuthLayout.vue"),
    name: "login",
    meta: {
      requiredAuth: false,
    },
    children: [
      {
        path: "/login",
        component: () => import("pages/auth/LoginPage.vue"),
        name: "login",
      },
      {
        path: "/register",
        component: () => import("pages/auth/RegisterPage.vue"),
        name: "register",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
    name: "errorNotFound",
  },
];

export default routes;
