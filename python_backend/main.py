from langchain import OpenAI, SQLDatabase, SQLDatabaseChain, PromptTemplate
from flask import Flask,request,jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
 
from langchain import OpenAI

from datetime import datetime

import os
import constants
load_dotenv()
Base = declarative_base()

app = Flask(__name__)
CORS(app)
class MyTable(Base):
    __tablename__= 'QueryLogs'
    id = Column(Integer, primary_key=True)
    Input = Column(String(255))
    Output = Column(String(255))
    Time = Column(String(255))

class CustomerSupport(Base):
    __tablename__= 'CustomerSupport'
    id = Column(Integer, primary_key=True)
    Name = Column(String(255))
    Email = Column(String(255))
     
@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

@app.route("/support", methods=['POST'])
def support():
    res=request.get_json()
    DATABASE_URL =  'mysql://u185343794_admin:1VZ/Qcgax>@217.21.73.201:3306/u185343794_ajaffee_va'
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    Base.metadata.create_all(engine)
    new_entry_1 = CustomerSupport(Name=res['name'], Email=res['email'])
    session.add(new_entry_1)
    session.commit()
    return res

@app.route('/first', methods=['POST'])
def first():
    db = SQLDatabase.from_uri('mysql+pymysql://u185343794_admin:1VZ/Qcgax>@217.21.73.201:3306/u185343794_ajaffee_va',include_tables=['AjaffeFAQs','AjaffeRetailPriceSheet'])
    llm = OpenAI(temperature=0, openai_api_key='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')
 
    
    db_chain = SQLDatabaseChain(llm=llm, database=db, verbose=True)
    data=request.get_json()
    prompt=data['prompt']
    question = constants.prompt_template.format(Style=prompt)
    response=db_chain.run(question)
    if(response=='Results not found, you can reach out with query on csd@ajaffe.com or do you want to reach out to customer support with your inquiry?'):
        DATABASE_URL = 'mysql://u185343794_admin:1VZ/Qcgax>@217.21.73.201:3306/u185343794_ajaffee_va'
        time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        Base.metadata.create_all(engine)
        new_entry_1 = MyTable(Input=prompt, Output=response, Time=time)
        session.add(new_entry_1)
        session.commit()
    
    return jsonify({"response":response})
if __name__ == '__main__':
    app.run(host='0.0.0.0')
    
    