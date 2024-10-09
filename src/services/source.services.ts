import { HttpException } from "@/exceptions/HttpException";
import sourceModel from "@/models/source.model";
import { codes, message } from "@/utils/messages";

export class SourceService {
    public source = sourceModel

    public async listAllSource(query: any, skip: any, limit: any) {
        const allsourceData = await this.source.find(query)
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt')
            .sort({ createdAt: -1 })
            .lean()

        if (allsourceData) {
            return allsourceData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async getAllSource(skip: any, limit: any) {
        const allsourceData = await this.source.find()
            .skip(skip)
            .limit(limit)
            .select('-modifiedAt')
            .sort({ createdAt: -1 })
            .lean()

        if (allsourceData) {
            return allsourceData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToGetData);
        }
    }

    public async addSource(data: any) {
        const newSource = await this.source.create(data);
        if (newSource) {
            return newSource
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToCreate);
        }
    }

    public async findSource(data: any) {
        const findSource = await this.source.findOne({ sourceName: data.sourceName })
        if (findSource) {
            return findSource
        }
    }

    public async updateSource(data: any) {
        const { id, ...rest } = data;
        const updateSource = await this.source.findOneAndUpdate({ _id: data.id }, rest, { new: true, runValidators: true })
        if (updateSource) {
            return updateSource
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToUpdate);
        }
    }

    public async deleteSource(data: any) {
        const sourcedata = await this.source.findByIdAndDelete({ _id: data.id })
        if (sourcedata) {
            return sourcedata
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToDelete);
        }
    }

    public async changeStatus(data: any) {
        const sourceData = await this.source.findOneAndUpdate(
            { _id: data.id }, { status: data.status },
            { new: true, runValidators: true }
        )
        if (sourceData) {
            return sourceData
        } else {
            throw new HttpException(codes.error.badRequest, message.failed.failedToChangeStatus);
        }
    }
}