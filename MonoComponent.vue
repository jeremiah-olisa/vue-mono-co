<script lang="ts" setup>
import { useMonoConnect } from ".";
import type { OnMonoConnectClose, OnMonoConnectSuccess } from "./types";
const { onClose, onSuccess } = defineProps<{
  onSuccess: OnMonoConnectSuccess;
  onClose: OnMonoConnectClose;
}>();

const { openConnect } = useMonoConnect(onSuccess, onClose);
</script>

<template>
  <div role="button" tabindex="0" @click="openConnect">
    <slot />
  </div>
</template>
