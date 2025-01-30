declare module "#app" {
  interface NuxtApp {
    $auth: Auth;
    $firestore: Firestore;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $auth: Auth;
    $firestore: Firestore;
  }
}

export {};
