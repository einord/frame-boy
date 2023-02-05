// TODO: This is not working yet. Need to figure out how to get the auto-update to work.
// https://www.electronjs.org/docs/latest/tutorial/updates

// import { dialog, app } from 'electron';
// import { autoUpdater, UpdateInfo } from 'electron';

// export default () => {
//     if (app.isPackaged) {
//         autoUpdater.autoInstallOnAppQuit = true;
//         autoUpdater.checkForUpdates();
//         autoUpdater.addListener('update-downloaded', (info: UpdateInfo) => {
//             dialog
//                 .showMessageBox({
//                     title: 'Restart Believers Sword?',
//                     type: 'question',
//                     message: `New version "Believers Sword ${info.version}" has been successfully downloaded.`,
//                     buttons: ['Yes', 'Later', 'Yes, Update'],
//                     cancelId: 1,
//                 })
//                 .then(({ response }) => {
//                     if (response == 0 || response == 2) {
//                         autoUpdater.quitAndInstall();
//                     }
//                 });
//         });
//     }
// };
