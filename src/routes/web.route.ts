import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";
import { validate } from "@utils/validate";
import { login, register, editProfile, adminEditProfile } from "@/validation/user.joi.validation";
import { addTodo, changeTodoStatus, deleteTodo, updateToDo } from "@/validation/todo.joi.validation";
import { addReminder, updateReminder, deleteReminder, changeReminderStatus } from "@/validation/reminder.joi.validation";
import { addRequirement, changeRequirementStatus, deleteRequirement, updateRequirement } from "@/validation/requirement.joi.validation";
import { addSource, changeSourceStatus, deleteSource, updateSource } from "@/validation/source.joi.validation";
import { addInquiry, addProductionUserComment, changeInquiryStatus, changeStatus, deleteInquiry, discountOnRequirement, inquiryDetails, updateInquiryDetails, updateRemark } from "@/validation/inquiry.joi.validation";
import { WebDashboardController } from "@/controllers/web/dashboard.controller";
import { AuthController } from "@/controllers/web/auth.controller";
import { WebToDoController } from "@/controllers/web/todo.controller";
import { WebSourceController } from "@/controllers/web/source.controller";
import { WebRequirementController } from "@/controllers/web/requirement.controller";
import { WebReminderController } from "@/controllers/web/reminder.controller";
import { WebInquiryController } from "@/controllers/web/inquiry.controller";
import { UserController } from "@/controllers/web/user.controller";
import { webNotification } from "@/controllers/web/notification.controller";
import { WebCategoryController } from "@/controllers/web/category.controller";
import { WebProductController } from "@/controllers/web/product.controller";
import { addCategory, deleteCategory } from "@/validation/category.validation";
import { addOrDeleteProductImage, addProduct, updateProduct } from "@/validation/product.validation";
import authMiddleware from "@/middlewares/auth.middleware";
import checkRole from "@/middlewares/check.role.middleware";
import { WebMessagesController } from "@/controllers/web/message.controller";
class webRoutes implements Routes {
    public path = '/web';
    public router = Router();
    public userController = new UserController();
    public authController = new AuthController();
    public webDashoardController = new WebDashboardController();

    public TodoController = new WebToDoController();
    public ReminderController = new WebReminderController();
    public RequirementController = new WebRequirementController();
    public SourceController = new WebSourceController();
    public InquiryController = new WebInquiryController();
    public notificationController = new webNotification()
    public CategoryController = new WebCategoryController()
    public ProductController = new WebProductController()
    public MessagesController = new WebMessagesController()

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //User Routes: 
        this.router.post(`${this.path}/login`, validate(login), this.authController.login);
        this.router.post(`${this.path}/register`, authMiddleware, checkRole('Admin'), validate(register), this.userController.register);
        this.router.post(`${this.path}/users`, authMiddleware, checkRole('Admin'), this.userController.getAllUsers);
        this.router.get(`${this.path}/profile`, authMiddleware, this.userController.getUserDetails)
        this.router.post(`${this.path}/edit-profile`, authMiddleware, validate(editProfile), this.userController.editUserProfile)
        this.router.post(`${this.path}/admin-edit-profile`, authMiddleware, checkRole('Admin'), validate(adminEditProfile), this.userController.adminEditUserProfile)
        this.router.post(`${this.path}/get-managers-and-staff`, authMiddleware, this.userController.getAllManagerAndStaff)
        this.router.post(`${this.path}/admin-change-user-status`, authMiddleware, checkRole('Admin'), this.userController.adminChangeUserStatus)
        this.router.get(`${this.path}/top-users`, authMiddleware, checkRole('Admin'), this.userController.topUserList)
        this.router.post(`${this.path}/decode-token`, this.authController.decodeToken)

        //Dashboard Routes: 
        this.router.get(`${this.path}/dashboard`, authMiddleware, this.webDashoardController.getDashboardData);
        this.router.get(`${this.path}/dashboard-chart`, authMiddleware, this.webDashoardController.getDashboardChartData);
        this.router.get(`${this.path}/admin-dashboard`, authMiddleware, checkRole('Admin'), this.webDashoardController.getAdminDashboardData);

        //Todo Routes: 
        this.router.post(`${this.path}/todo`, authMiddleware, this.TodoController.allTodos);
        this.router.post(`${this.path}/add-todo`, authMiddleware, validate(addTodo), this.TodoController.addTodo);
        this.router.post(`${this.path}/update-todo`, authMiddleware, validate(updateToDo), this.TodoController.updateTodo);
        this.router.delete(`${this.path}/delete-todo`, authMiddleware, validate(deleteTodo), this.TodoController.deleteTodo);
        this.router.post(`${this.path}/change-todo-status`, authMiddleware, validate(changeTodoStatus), this.TodoController.changeCompletionStatus);

        //Reminder Routes:
        this.router.post(`${this.path}/reminder`, authMiddleware, this.ReminderController.allReminders);
        this.router.post(`${this.path}/add-reminder`, authMiddleware, validate(addReminder), this.ReminderController.addReminder);
        this.router.post(`${this.path}/update-reminder`, authMiddleware, validate(updateReminder), this.ReminderController.updateReminder);
        this.router.delete(`${this.path}/delete-reminder`, authMiddleware, validate(deleteReminder), this.ReminderController.deleteReminder);
        this.router.post(`${this.path}/change-reminder-status`, authMiddleware, validate(changeReminderStatus), this.ReminderController.changeReminderStatus);

        //Requirement Routes:
        this.router.get(`${this.path}/requirement`, authMiddleware, this.RequirementController.allRequirements);
        this.router.post(`${this.path}/user-requirement`, authMiddleware, this.RequirementController.getUserRequirements);
        this.router.post(`${this.path}/add-requirement`, authMiddleware, validate(addRequirement), this.RequirementController.addRequirement);
        this.router.post(`${this.path}/update-requirement`, authMiddleware, validate(updateRequirement), this.RequirementController.updateRequirement);
        this.router.delete(`${this.path}/delete-requirement`, authMiddleware, validate(deleteRequirement), this.RequirementController.deleteRequirement);
        this.router.post(`${this.path}/change-requirement-status`, authMiddleware, validate(changeRequirementStatus), this.RequirementController.changeCompletionStatus);

        //Source Routes:
        this.router.get(`${this.path}/source`, authMiddleware, this.SourceController.allSource);
        this.router.post(`${this.path}/add-source`, authMiddleware, validate(addSource), this.SourceController.addSource);
        this.router.post(`${this.path}/update-source`, authMiddleware, validate(updateSource), this.SourceController.updateSource);
        this.router.delete(`${this.path}/delete-source`, authMiddleware, validate(deleteSource), this.SourceController.deleteSource);
        this.router.post(`${this.path}/change-source-status`, authMiddleware, validate(changeSourceStatus), this.SourceController.changeSourceStatus);

        //Inquiry Routes:
        this.router.post(`${this.path}/inquiry`, authMiddleware, this.InquiryController.allInquiries);
        this.router.post(`${this.path}/add-inquiry`, authMiddleware, validate(addInquiry), this.InquiryController.addNewInquiry);
        this.router.post(`${this.path}/inquiry-details`, authMiddleware, validate(inquiryDetails), this.InquiryController.getInquiryDetails);
        this.router.post(`${this.path}/update-inquiry`, authMiddleware, validate(updateInquiryDetails), this.InquiryController.updateInquiryDetails);
        this.router.post(`${this.path}/update-inquiry-remark`, authMiddleware, validate(updateRemark), this.InquiryController.updateInquirRemark);
        this.router.delete(`${this.path}/delete-inquiry`, authMiddleware, validate(deleteInquiry), this.InquiryController.deleteInquiry);
        this.router.post(`${this.path}/change-inquiry-status`, authMiddleware, validate(changeInquiryStatus), this.InquiryController.changeInquiryStepStatus)
        this.router.post(`${this.path}/admin-list-inquiry-by-user`, authMiddleware, checkRole('Admin'), this.InquiryController.adminListInquiryByUser);
        this.router.post(`${this.path}/change-status`, authMiddleware, validate(changeStatus), this.InquiryController.changeStatus);
        this.router.post(`${this.path}/party-names`, authMiddleware, this.InquiryController.getpartyNameList);
        this.router.post(`${this.path}/discount-on-reqirement`, authMiddleware, validate(discountOnRequirement), this.InquiryController.discountOnRequirement);
        this.router.post(`${this.path}/add-production-user-comment`, authMiddleware, validate(addProductionUserComment), this.InquiryController.addProductionUserComment);

        // Notification Routes: 
        this.router.post(`${this.path}/notification`, authMiddleware, this.notificationController.notificationList);
        this.router.post(`${this.path}/clear-notification`, authMiddleware, this.notificationController.clearNotification);

        // Category
        this.router.post(`${this.path}/get-category`, this.CategoryController.getCategory);
        this.router.post(`${this.path}/add-category`, authMiddleware, checkRole('Production Admin') , validate(addCategory), this.CategoryController.addCategory);
        this.router.post(`${this.path}/update-category`, authMiddleware, checkRole('Production Admin'), this.CategoryController.updateCategory);
        this.router.post(`${this.path}/delete-category`, authMiddleware, checkRole('Production Admin'), validate(deleteCategory), this.CategoryController.deleteCategory);
        this.router.post(`${this.path}/search-category-and-product`,this.CategoryController.globalSearchForCategoryAndProduct);
        
        // Product 
        this.router.post(`${this.path}/get-product`, this.ProductController.getProducts);
        this.router.post(`${this.path}/get-multiple-products`, this.ProductController.getMultipleProductsById);
        this.router.post(`${this.path}/get-product-images`, this.ProductController.getProductsImgById);
        this.router.post(`${this.path}/add-product`, authMiddleware, checkRole('Production Admin') , validate(addProduct) ,this.ProductController.addProduct);
        this.router.post(`${this.path}/update-product`, authMiddleware, checkRole('Production Admin'), validate(updateProduct), this.ProductController.
        updateProduct);
        this.router.post(`${this.path}/delete-product`, authMiddleware, checkRole('Production Admin') ,this.ProductController.deleteProduct);
        this.router.post(`${this.path}/add-or-delete-product-images`, authMiddleware, checkRole('Production Admin') , validate(addOrDeleteProductImage) ,this.ProductController.addOrDeleteProductImage);
        this.router.post(`${this.path}/share-images`, authMiddleware, this.ProductController.shareImages);

        //Chat
        this.router.post(`${this.path}/store-message`, authMiddleware, this.MessagesController.storeMessage);
        this.router.post(`${this.path}/send-documents`, authMiddleware, this.MessagesController.sendDocument);

    }
}

export default webRoutes