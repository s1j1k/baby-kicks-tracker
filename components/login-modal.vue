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
          @submit="loginWithEmail"
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

          <!-- TODO make it blue not gray? to match color scheme? -->
          <UButton label="Login" color="gray" block type="submit" />
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
          label="Login with Google"
          icon="i-simple-icons-google"
          block
          @click="handleGoogleSignIn"
        />
      </div>
    </UCard>
  </UModal>
</template>

<!-- FIXME after logging out of google the modal shows up again - maybe disable that? -->

<script setup lang="ts">
import type { ModelRef } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { AuthErrorCodes } from "firebase/auth";

const open: ModelRef<boolean | undefined> = defineModel();

const { signInGooglePopup, signInEmailPassword } = useFirebaseAuth();

const errorText = ref("");
const isError = ref(false);

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

// TODO catch and display errors for Google login as well

// TODO include alerts/feedback for different kind of failures: user not found, etc
async function loginWithEmail(event: FormSubmitEvent<Schema>) {
  try {
    const userCredential = await signInEmailPassword(
      event.data.email,
      event.data.password
    );
    isError.value = false;
    errorText.value = "";
    open.value = false;
    return userCredential.user; // Return user info if needed
  } catch (error) {
    // https://firebase.google.com/docs/reference/js/auth#autherrorcodes
    // Catch Firebase Auth errors here
    console.error("Login failed:", error);
    // Handle specific error codes if required
    // @ts-expect-error
    switch (error.code) {
      case AuthErrorCodes.USER_DELETED:
        errorText.value = "No user found with this email.";
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        errorText.value = "Incorrect password.";
        break;
      case AuthErrorCodes.INVALID_EMAIL:
        errorText.value = "Invalid email address.";
        break;
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        errorText.value = "Incorrect email or password.";
        break;
      default:
        errorText.value = "Something went wrong.";
    }
    isError.value = true;
    return false; // Indicate failure
  }
}

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

// Email Sign-in
const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});
</script>
