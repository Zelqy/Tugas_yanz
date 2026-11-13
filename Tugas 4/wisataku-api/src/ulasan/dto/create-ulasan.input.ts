import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateUlasanInput {
  @Field(() => Int)
  destinasiId: number;

  @Field(() => Int)
  rating: number;

  @Field()
  komentar: string;
}
