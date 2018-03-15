require 'rails_helper'

RSpec.describe Cat, type: :model do
  it "should validate name" do
    cat = Cat.new()
    expect(cat.valid?).to be false
    expect(cat.errors[:name]).to_not be_empty
  end
end
