export const message = {
  user: {
    loggedIn: 'Logged in Successfully.',
    loginFailed: 'Please Check The Credentials.',
    invalidToken: 'Invalid Authentication Token.',
    tokenMissing: 'Authentication Token Missing.',
    logoutSuccessfull: 'Logged out successfully.',
    logoutFailed: 'Loggin out failed',
    emailNotFound: 'Email Is Not Registered.',
    invalidEmail: 'Invalid Email, please Enter Email In Correct Format.',
    invalidPassword: 'Incorrect Password.',
    userNotFound: 'User Not Found.',
    createdUser: 'User Created Successfully.',
    creatingUserFailed: 'Cannot Create User.',
    getUserByID: 'Fetched User By ID Successfully.',
    getUsers: 'Fetched All Users Successfully.',
    updatedUser: 'User Data Updated Successfully.',
    updateUserFailed: 'Cannot Update User Data.',
    deletedUser: 'User Deleted.',
    incorrectEmail: 'Incorrect email!',
    incorrectPassword: 'Incorrect password!',
    emailAlreadyExits: 'Email already exits , try with another email',
    registerSuccessfully: 'Registered successfully',
    passwordAndConfirmPasswordNotMatch:
      'Password and corfirm password does not match',
    fetchedAllUsers: 'All users fetched successfully',
    profileDetails: 'Fetched profile details successfully',
    profileDetailUpdated: 'Profile details updated successfully',
    changeStatus: 'Changed User Status Successfully',
    getManagerAndStaff: 'Fetched all managers and staff successfully',
    topUserList: 'Top user list',
  },

  inquiry: {
    fetchAllInquiries: 'Fetched all inquires successfully.',
    inquiryCreated: 'Inquiry added successfully.',
    inquiryUpdated: 'Inquiry updated successfully.',
    inquiryDeleted: 'Inquiry deleted successfully.',
    stepStatusUpdated: 'Status of inquiry updated successfully.',
    partNameList: 'Party name list.',
    discountOnRequirements:
      'Requests to discount on requirement sent successfully.',
    commentAdded: 'Comment added successfully.',
  },

  toDo: {
    fetchAllToDo: 'Fetched all todos successfully.',
    createdToDo: 'To-Do added successfully.',
    updatedToDo: ' To-Do updated successfully.',
    deletedToDo: 'To-Do deleted successfully.',
    changeStatus: 'To-do status updated successfully',
  },

  reminder: {
    fetchAllReminders: 'Fetched all reminders successfully.',
    reminderCreated: 'Reminder created successfully.',
    reminderUpdated: 'Reminder updated Successfully.',
    reminderDeleted: 'Reminder deleted successfully.',
    changeStatus: 'Reminder status updated successfully',
  },

  requirements: {
    fetchAllrequirement: 'Fetched all requirement successfully.',
    requirementCreated: 'Requirement created successfully.',
    requirementUpdated: 'Requirement updated Successfully.',
    requirementDeleted: 'Requirement deleted successfully.',
    changeStatus: 'Requirement status updated successfully',
    requirementAlreadyExist: 'requirement is already exist.'
  },

  failed: {
    failedToCreate: 'Something went wrong! Failed to add',
    failedToUpdate: 'Something went wrong! Failed to update',
    failedToDelete: 'Something went wrong! Failed to delete',
    failedToChangeStatus: 'Something went wrong! Failed to change status',
    failedToGetData: 'Something went wrong! Failed to get any data',
    permissionDenied:
      'Permission denied ! You do not have access for this action',
    somethingWentWrong: 'Something went wrong!',
    failedToSentDiscount: 'Something went wrong! Failed to sent discount.',
    failedToAddComment: 'Something went wrong! Failed to add comment.',
  },

  success: {
    getDataSuccess: 'Data get successfully.',
    tokenGetSuccess: 'Token get successfully.'
  },

  source: {
    fetchAllSources: 'Fetched all sources successfully.',
    sourceCreated: 'Source created successfully.',
    sourceUpdated: 'Source updated Successfully.',
    sourceDeleted: 'Source deleted successfully.',
    changeStatus: 'Source status updated successfully',
    sourceAlreadyExists:
      'Source name already exists , try with another source name.',
  },

  notification: {
    allNotification: 'Notification List',
    newNotification: 'New notification added successfully',
    clearNotification: 'All notification cleared.',
  },

  file: {
    fileNotFound: 'File not found',
    fileTypeInvalid:
      'File type is invalid, file format should be .png, .jpg, .jpeg, .doc, .docx, .pdf, .csv, .xls, .xlsx',
    fileTooBig: 'File is too big, file must be less then 5MB ',
    fileUploadfailed: 'File upload failed',
  },

  category: {
    fetchCategorySuccess: 'Fetched all category successfully.',
    addedCategory: 'Category created successfully.',
    updatedCategory: 'Category updated successfully.',
    deletedCategory: 'Category deleted successfully.',
    categoryAlreadyExists: 'This category is already exists.',
    categoryNotFound: 'Category not found.',
    getUrlSuccess: 'Url get successfully.',
  },

  product: {
    fetchProductSuccess: 'Fetched all product successfully.',
    addedProduct: 'Product added successfully.',
    updatedProduct: 'Product updated successfully.',
    productAlreadyExists: 'This product is already exists.',
    productNotFound: 'Product not found.',
    deletedProduct: 'Product deleted successfully.',
    productGetSuccess: 'Products get successfully.',

  },

  chatMessage: {
    fetchMessagesSuccess: 'Fetched all message successfully.',
    messageStored: 'Message stored successfully.',
    failToStoreMessage: 'Fail to store message.',
    fetchMessageSuccess: 'Messages fetch successfully.',
    docStoredSuccess: 'Document stored successfully.',
  },
};

export const codes = {
  success: {
    ok: 200,
    dataCreated: 201,
  },

  error: {
    badRequest: 400,
    unAuthorized: 401,
    forbidden: 403,
    notFound: 404,
    timeOut: 408,
    serverError: 500,
    conflict: 409,
  },
};

export const ChatEvent = {
  JOIN_ROOM: 'joinRoom',
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  SEND_MESSAGE: 'sendMessage',
  REC_MESSAGE: 'receiveMessage',
  REC_ALL_MESSAGE: 'receiveAllMessageList',
};
