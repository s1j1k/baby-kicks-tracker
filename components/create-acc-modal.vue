<template>
  <!-- <div class="w-full flex flex-col gap-y-4"> -->
    <UModal v-model="open">
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

            <!-- TODO make it blue not gray? to match color scheme? -->
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
            label="Login with Google"
            icon="i-simple-icons-google"
            block
            @click="signInGooglePopup"
          />
        </div>
      </UCard>
    </UModal>
  <!-- </div> -->
</template>

<!-- FIXME after logging out of google the modal shows up again - maybe disable that? -->

<script setup lang="ts">
import type { ModelRef } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const open: ModelRef<boolean | undefined> = defineModel();

const { registerUser, signInGooglePopup } = useFirebaseAuth();

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

// TODO include alerts/feedback for different kind of failures
async function createAccEmail(event: FormSubmitEvent<Schema>) {
  await registerUser(event.data.email, event.data.password);
}

// Email Sign-in
const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});
</script>
