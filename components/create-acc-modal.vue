<template>
  <UModal
    v-model="open"
    :ui="{
      container: 'flex min-h-full items-center justify-center text-center',
    }"
  >
    <UCard>
      <div class="space-y-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="createAccEmail"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

          <UAlert
            v-if="isError"
            color="red"
            variant="soft"
            :description="errorText"
          />

          <UButton label="Create Account" color="gray" block type="submit" />
        </UForm>

        <UDivider label="OR" />

        <!-- TODO add other providers -->
        <!-- <UButton
          color="black"
          label="Login with GitHub"
          icon="i-simple-icons-github"
          block
        /> -->
        <UButton
          color="black"
          label="Sign up with Google"
          icon="i-simple-icons-google"
          block
          @click="handleGoogleSignIn"
        />
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { ModelRef } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { AuthErrorCodes } from "firebase/auth";

const open: ModelRef<boolean | undefined> = defineModel();

const { registerUser, signInGooglePopup } = useFirebaseAuth();

const errorText = ref("");
const isError = ref(false);

async function handleGoogleSignIn() {
  const { success, message } = await signInGooglePopup();
  if (success) {
    console.info("Google sign-in successful.");
    errorText.value = "";
    isError.value = false;
    open.value = false;
  } else {
    errorText.value = message;
    isError.value = true;
  }
}

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});


async function createAccEmail(event: FormSubmitEvent<Schema>) {
  try {
    const userCredential = await registerUser(
      event.data.email,
      event.data.password
    );
    return userCredential.user; // Return user info if needed
  } catch (error) {
    // Catch Firebase Auth errors here
    console.error("Registration failed:", error);
    // Handle specific error codes
    // @ts-expect-error
    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        errorText.value = "Email is already in use.";
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        errorText.value = "Invalid email address.";
        break;
      case AuthErrorCodes.WEAK_PASSWORD:
        errorText.value = "Password is too weak.";
        break;
      default:
        errorText.value = "Something went wrong.";
    }
    isError.value = true;
    return false; // Indicate failure
  }
}

// Email Registration
const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});
</script>
