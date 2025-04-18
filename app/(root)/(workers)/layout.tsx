import { Stack } from "expo-router"

export default function WorkersLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Workers",
          headerShown: true
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: "Worker Details",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: "Add Worker",
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: "Edit Worker",
          headerShown: false
        }} 
      />
    </Stack>
  )
}
