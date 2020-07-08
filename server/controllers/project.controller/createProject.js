import Project from '../../models/project';
import User from '../../models/user';

export default function createProject(req, res) {

  function sendFailure(err) {
    res.json({ success: false, message: err});
  }

  User.findGuest((err,guest) => {
    
    
    let projectValues = {
      user: req.user ? req.user._id : guest._id //'5efb43c34c0aa827b4843720'
    };
  
    projectValues = Object.assign(projectValues, req.body);
  
    function populateUserData(newProject) {
      return Project.populate(
        newProject,
        { path: 'user', select: 'username' },
        (err, newProjectWithUser) => {
          if (err) {
            sendFailure(newProject);
            return;
          }
          res.json(newProjectWithUser);
        }
      );
    }
  
    return Project.create(projectValues)
      .then(populateUserData)
      .catch(sendFailure);
  });
  

  
  
}
