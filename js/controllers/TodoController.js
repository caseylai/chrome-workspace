define(['controllers/controllers'], function(controllers) {

	controllers.controller('TodoController', ['$scope', function($scope) {

		if (! $scope.workspace.todos) {
			$scope.workspace.todos = [];
		}
		$scope.todos = $scope.workspace.todos;

		$scope.$watch('todos', function() {
			$scope.todoLeft = $scope.todos.filter(function(todo) {
				return ! todo.done;
			}).length;
		}, true);

		$scope.addTodo = function($event) {
			if ($event.keyCode == 13) {
				$scope.todos.unshift({
					done: false,
					content: $scope.newTodo
				});
				$scope.newTodo = '';
			}
		};

		$scope.toggleDone = function(todo) {
			todo.done = !todo.done;
		};

		$scope.removeTodo = function(index) {
			$scope.todos.splice(index, 1);
		};

		$scope.removeDone = function() {
			$scope.workspace.todos = $scope.todos = $scope.todos.filter(function(todo) {
				return ! todo.done;
			});
		};

	}]);

});
