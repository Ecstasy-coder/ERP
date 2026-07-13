const router = require('./routes/examRoutes');
console.log(router.stack.map((layer) => ({
  name: layer.name,
  route: layer.route && layer.route.path,
  methods: layer.route && layer.route.methods,
})));
