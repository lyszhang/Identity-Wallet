'use strict';
const { Logger } = require('common/logger/logger');
const log = new Logger('add-edit-doc-ctl');

function AddEditDocumentDialogController(
	$rootScope,
	$scope,
	$mdDialog,
	RPCService,
	CommonService,
	mode,
	idAttributeType,
	idAttribute
) {
	'ngInject';

	log.log('AddEditDocumentDialogController');
	$scope.idAttributeType = idAttributeType;

	if (mode === 'update') {
		$scope.idAttribute = idAttribute;
	}

	$scope.savePromise = null;
	$scope.selectedFile = null;

	$scope.close = event => {
		$mdDialog.cancel();
	};

	$scope.save = event => {
		if (!$scope.selectedFile || $scope.savePromise) {
			return;
		}

		if (mode === 'create') {
			$scope.savePromise = RPCService.makeCall('addIdAttribute', {
				walletId: $rootScope.wallet.id,
				type: idAttributeType,
				data: {},
				document: $scope.selectedFile
			});

			$scope.savePromise
				.then(() => {
					CommonService.showToast('success', 'saved');
					$mdDialog.hide();
				})
				.catch(error => {
					log.error(error);
					CommonService.showToast('error', 'error while saving document');
				});
		} else {
			$scope.savePromise = RPCService.makeCall('addEditDocumentToIdAttributeItemValue', {
				idAttributeId: idAttribute.id,
				file: $scope.selectedFile
			});

			$scope.savePromise
				.then(() => {
					$mdDialog.hide();
				})
				.catch(error => {
					log.error(error);
					CommonService.showToast('error', 'error while saving document');
				});
		}
	};

	$scope.selectFile = event => {
		let fileSelect = RPCService.makeCall('openFileSelectDialog', {
			filters: [{ name: 'Documents', extensions: ['jpg', 'jpeg', 'png', 'pdf'] }],
			maxFileSize: 50 * 1000 * 1000
		});
		fileSelect
			.then(selectedFile => {
				$scope.selectedFile = selectedFile;
			})
			.catch(error => {
				log.error(error);
				CommonService.showToast(
					'error',
					'The file could not be uploaded. The file exceeds the maximum upload size. Please upload file no larger than 50 MB.'
				);
			});
	};

	$scope.$on('selfkey:on-keypress', (event, key) => {
		if (key === 'Enter') {
			$scope.save(event);
		}
	});

	$scope.ignoreEnterKey = event => {
		event.stopImmediatePropagation();
		event.stopPropagation();
		event.preventDefault();

		$scope.save(event);
	};
}

AddEditDocumentDialogController.$inject = [
	'$rootScope',
	'$scope',
	'$mdDialog',
	'RPCService',
	'CommonService',
	'mode',
	'idAttributeType',
	'idAttribute'
];
module.exports = AddEditDocumentDialogController;
