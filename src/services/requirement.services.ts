import { HttpException } from "@/exceptions/HttpException";
import { codes, message } from "@/utils/messages";
import requirementModel from "@/models/requirement.model";

export class RequirementService {
    public requirement = requirementModel

    public async listAllRequirement(query: any, skip: any, limit: any) {
        const allrequirementData = await this.requirement.find(query)
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt')
            .sort({ createdAt: -1 })
            .lean()

        if (allrequirementData) {
            return allrequirementData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }
    public async addRequirement(data: any) {
        const findRequirement = await this.requirement.findOne({ userId: data.userId, requirement: data.requirement })
        if(findRequirement) throw new HttpException(codes.error.conflict, `${data.requirement} ${message.requirements.requirementAlreadyExist}`);
        const newRequirement = await this.requirement.create(data);
        if (newRequirement) {
            return newRequirement
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async updateRequirement(data: any) {
        const { id, ...rest } = data;
        const updateRequirement = await this.requirement.findOneAndUpdate({ _id: data.id }, rest, { new: true, runValidators: true });
        if (updateRequirement) {
            return updateRequirement
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async deleteRequirement(data: any) {
        const requiementData = await this.requirement.findByIdAndDelete({ _id: data.id })
        if (requiementData) {
            return requiementData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToDelete);
        }
    }

    public async changeStatus(data: any) {
        const requirementData = await this.requirement.findOneAndUpdate(
            { _id: data.id }, { status: data.status },
            { new: true, runValidators: true }
        )
        if (requirementData) {
            return requirementData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToChangeStatus);
        }
    }
}