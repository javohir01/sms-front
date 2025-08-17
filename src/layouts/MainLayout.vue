<template>
  <div class="grid grid-cols-3">
    <header class="col-span-3"> <!-- Header component --> </header>
    <nav class="col-span-1"> <!-- Sidebar: Navigation links --> </nav>
    <main class="col-span-2"><slot /></main> <!-- Main content slot -->
    <aside class="col-span-1"><slot name="sidebar" /></aside> <!-- Sidebar widgets -->
    <footer class="col-span-3"> <!-- Footer --> </footer>
  </div>
</template>